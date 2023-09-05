import * as Yup from "yup";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import SubNavBar from "../SubNavbar/SubNavbar";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import { useEffect, useRef, useState } from "react";
import { Button, MenuItem, Select } from "@mui/material";
import { MdOutlineDelete, MdContentCopy, MdOutlineEdit } from "react-icons/md";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { IoMdSettings, IoIosArrowDown } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { editItem } from "../../services/estimateServices";
import {
  addNewBill,
  editBill,
  getAddNewBill,
  getAllBills,
} from "../../services/billServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../Modal/ModalComponent";
import { setItem } from "../../redux/ducks/itemSlice";
import generatePdf from "../EstimateDashboard/PdfGenerator";
import dayjs from "dayjs";
import { setTax } from "../../redux/ducks/taxSlice";
import AddNewCustomerModal from "../AddNewCustomerModal/AddNewCustomerModal";
import { City, Country, State } from "country-state-city";
import { setCountryCode } from "../../redux/ducks/countrySlice";
import { setBill, setLastBill } from "../../redux/ducks/billSlice";
import { changeBillingAddress } from "../../services/vendorServices";
import { setVendor } from "../../redux/ducks/vendorSlice";

const schema = Yup.object().shape({
  vendor: Yup.string().required("Please add a vendor"),
  status: Yup.string().required("Status is required"),
  billDate: Yup.date().required("Bill date is required"),
  expiryDate: Yup.date()
    .required("Expiry date is required")
    .min(Yup.ref("billDate"), "Expiry Date must be after Bill Date"),
  billingAddress: Yup.string().required("Billing address is required"),
  billingCity: Yup.string().required("City is required"),
  billingState: Yup.string().required("State is required"),
  billingZipOrPostalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Zip code must be a 6-digit number")
    .required("Zip code is required"),
  billingContactNumber: Yup.string().required("Contact number is required"),
  terms: Yup.string().required("Terms is required"),
  orderNumber: Yup.string().required("Order number is required"),
  notes: Yup.string().required("Notes is required"),
});

const itemSchema = Yup.object().shape({
  itemName: Yup.string().required("Item name is required"),
  retailPrice: Yup.string().required("Price is required"),
  itemDescription: Yup.string().required("Description is required"),
});

const billingAddressSchema = Yup.object().shape({
  billingAddress: Yup.string().required("Billing address is required"),
  billingCity: Yup.string().required("City is required"),
  billingState: Yup.string().required("State is required"),
  billingZipOrPostalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Zip code must be a 6-digit number")
    .required("Zip code is required"),
  billingContactNumber: Yup.string().required("Contact number is required"),
});

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};
const baseStyle2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

const modal2Style = {
  width: 417,
};
const modal2Style2 = {
  width: "50%",
};

const modal2Style3 = {
  width: "80%",
};

const initialFormValues = { status: "Draft", tcs: "" };
const initialAddress = {
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingZipOrPostalCode: "",
  billingContactNumber: "",
  billingStateIso: "",
};

const AddAndEditBill = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editItemsFormValues = useRef();
  const stockManager = useRef({ items: [] });
  const formValues = useRef(initialFormValues);
  const { taxes } = useSelector((state) => state);
  const billingAddressValues = useRef(initialAddress);
  const itemsList = useSelector((state) => state.items.data);
  const { countryCode } = useSelector((state) => state.country);
  const { vendorsList } = useSelector((state) => state.vendors);
  const { lastBill, billsList } = useSelector((state) => state.bill);

  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formAddress, setFormAddress] = useState(initialAddress);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [itemInput, setItemInput] = useState("");
  const [country, setCountry] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [itemDetails, setItemDetails] = useState("");
  const [addNewLine, setAddNewLine] = useState(true);
  const [editAddress, setEditAddress] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [billDate, setBillDate] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [discountOptions, setDiscountOptions] = useState("₹");
  const [filteredCityList, setFilteredCityList] = useState([]);
  const [outOfStockError, setOutOfStockError] = useState(null);
  const [selectedEditItem, setSelectedEditItem] = useState({});
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [filteredStateList, setFilteredStateList] = useState([]);
  const [tcsInputValue, setTcsInputValue] = useState("Select Tax");
  const [editItemFormErrors, setEditItemFormErrors] = useState({});
  const [discountInputValue, setDiscountInputValue] = useState(null);
  const [openPrintOrPreview, setOpenPrintOrPreview] = useState(false);

  const status = [
    {
      value: "Draft",
    },
    {
      value: "Send",
    },
    {
      value: "Viewed",
    },
    {
      value: "Accepted",
    },
    {
      value: "Expired",
    },
  ];

  const paymentTerms = [
    { value: "Due on receipt" },
    { value: "Due end of the month" },
    { value: "Due next Month" },
  ];

  const handleSubmit = async () => {
    if (outOfStockError) {
      const containsError = Object.values(outOfStockError).includes(true);

      if (containsError) {
        setShowAlert(true);
        return;
      }
    }

    if (stockManager?.current?.items?.length) {
      const newStock = stockManager.current.items
        .map((x) => {
          const item = itemDetails.find((y) => y._id === x._id);
          return item !== undefined ? x : null;
        })
        .filter((item) => item !== null);

      stockManager.current.items = newStock;
    }

    try {
      await schema.validate(formValues.current, { abortEarly: false });
      const formData = new FormData();
      const { tcs } = formValues.current;
      Object.keys(formValues.current).forEach((key) => {
        formData.append(key, formValues.current[key]);
      });
      formData.append("itemDetails", JSON.stringify(itemDetails));
      formData.append("vendorId", selectedVendor?._id);
      formData.append("email", selectedVendor?.email);
      formData.append("subTotal", subtotal);
      formData.append("discount", discount ? discount : 0);
      formData.append("total", total);

      if (tcs) {
        formData.append("tcs", JSON.stringify(tcs));
      }

      if (stockManager?.current?.items?.length) {
        formData.append(
          "stockManager",
          JSON.stringify(stockManager.current.items)
        );
      }

      if (!id) {
        formData.append(
          "bill",
          lastBill[0]?.bill
            ? (parseInt(lastBill[0]?.bill, 10) + 1)
                .toString()
                .padStart(lastBill[0]?.bill.length, "0")
            : "0001"
        );
        const object = Object.fromEntries(formData.entries());
        await addNewBill(object);
      } else {
        const object = Object.fromEntries(formData.entries());
        await editBill(object);
      }
      goBack();
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((innerError) => {
        validationErrors[innerError.path] = innerError.message;
      });
      setFormErrors(validationErrors);
    }
  };

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    formValues.current = { ...formValues.current, [name]: value };

    if (selectedBill?.length) {
      const items = { ...selectedBill[0], [name]: value };
      setSelectedBill([items]);
    }

    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleEditFormInputChange = async (event) => {
    const { name, value } = event.target;
    editItemsFormValues.current = {
      ...editItemsFormValues.current,
      [name]: value,
    };

    const items = { ...selectedEditItem, [name]: value };
    setSelectedEditItem(items);

    try {
      await Yup.reach(itemSchema, name).validate(value);
      setEditItemFormErrors({ ...editItemFormErrors, [name]: null });
    } catch (error) {
      setEditItemFormErrors({ ...editItemFormErrors, [name]: error.message });
    }
  };

  const handleSaveAndSend = () => {
    formValues.current = { ...formValues.current, actionType: true };
    handleSubmit();
  };

  const handleDropdown = (id) => {
    const button = document.getElementById(`${id}`);
    button?.classList?.contains("tw-hidden")
      ? button?.classList?.remove("tw-hidden")
      : button?.classList?.add("tw-hidden");
  };

  const handleDateChange = (date, dateFieldName) => {
    if (dateFieldName === "billDate") {
      setBillDate(date);
      formValues.current = { ...formValues.current, billDate: date };
    } else if (dateFieldName === "expiryDate") {
      setExpiryDate(date);
      formValues.current = { ...formValues.current, expiryDate: date };
    }

    const billDate = formValues.current.billDate;
    const expiryDate = formValues.current.expiryDate;

    schema
      .validateAt(dateFieldName, { billDate, expiryDate })
      .then(() => {
        setFormErrors({ ...formErrors, [dateFieldName]: null });
      })
      .catch((err) => {
        setFormErrors({ ...formErrors, [dateFieldName]: err.message });
      });
  };

  const handleDelete = (x) => {
    const { _id } = x;
    const newData = itemDetails?.filter((x) => x._id !== _id);

    const getOriginalId = x?.originalId ? x.originalId : x._id;

    const newStock = stockManager.current.items.map((y) => {
      if (y._id === getOriginalId) {
        if (x.selectedUnitType === "primaryUnit") {
          return {
            ...y,
            stockLeft: y.stockLeft + x.primaryUnitQuantity * x.selectedQuantity,
          };
        } else {
          const getUnit = x.stockConversion.filter(
            (z) => x.selectedUnit === z.secondaryUnit
          );

          return {
            ...y,
            stockLeft:
              y.stockLeft +
              Number(getUnit[0]?.numberOfSecondaryUnit) * x.selectedQuantity,
          };
        }
      }
      return y;
    });

    stockManager.current.items = newStock;

    setItemDetails(newData);
    calculateTotal();

    if (newData.length < 1) {
      setSubtotal(0);
      setTotal(0);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const buttons = [
    {
      buttonName: "Cancel",
      buttonStyles:
        "tw-px-3 tw-h-8 tw-py-1 tw-mr-4 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]",
      buttonFunction: goBack,
    },
    {
      buttonName: "Save",
      buttonStyles:
        "tw-px-3 tw-h-8 tw-py-1 tw-mr-4 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]",
      buttonFunction: handleSubmit,
    },
    {
      buttonName: "Save & Send",
      buttonStyles:
        "tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]",
      buttonFunction: handleSaveAndSend,
    },
  ];

  const handleQuantity = (value, item) => {
    const { _id } = item;
    const items = itemDetails.map((x) => {
      if (x._id === _id) {
        if (x.selectedQuantity < 2 && value === -1) {
          return null;
        }
        const exist = stockManager.current.items.filter(
          (x) => x._id === item._id || x._id === item.originalId
        );
        if (exist?.length) {
          if (x.selectedUnitType === "primaryUnit") {
            const stock = stockManager.current.items.map((x) => {
              if (exist[0]?._id === x._id) {
                if (value === +1)
                  return {
                    ...x,
                    stockLeft: x.stockLeft - item.primaryUnitQuantity,
                  };
                else if (value === -1)
                  return {
                    ...x,
                    stockLeft: x.stockLeft + item.primaryUnitQuantity,
                  };
              }

              return x;
            });

            stockManager.current.items = stock;
            return {
              ...x,
              selectedQuantity: x.selectedQuantity + value,
            };
          } else {
            const getUnit = x.stockConversion.filter(
              (y) => x.selectedUnit === y.secondaryUnit
            );
            const stock = stockManager.current.items.map((x) => {
              if (exist[0]?._id === x._id) {
                if (value === +1)
                  return {
                    ...x,
                    stockLeft: x.stockLeft - getUnit[0]?.numberOfSecondaryUnit,
                  };
                else if (value === -1)
                  return {
                    ...x,
                    stockLeft:
                      x.stockLeft + Number(getUnit[0]?.numberOfSecondaryUnit),
                  };
              }

              return x;
            });
            stockManager.current.items = stock;
            return {
              ...x,
              selectedQuantity: x.selectedQuantity + value,
            };
          }
        }
        return { ...x, selectedQuantity: x.selectedQuantity + value };
      }
      return x;
    });

    if (items.includes(null)) {
      return;
    }
    setItemDetails(items);
  };

  const handleFiltering = (event) => {
    const input = event.target.value;
    setInputValue(input);

    // Filter options by input value
    const filtered = vendorsList?.filter((option) => {
      const name = option.firstName + " " + option.lastName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredOptions(filtered);
  };

  const handleItemFiltering = (event) => {
    const input = event.target.value;
    setItemInput(input);

    const filtered = itemsList.filter((options) =>
      options.itemName.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handleInputClick = (inpId) => {
    const inp_select = document.getElementById(inpId);
    setFilteredOptions(vendorsList);

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleItemsInputClick = (inpId) => {
    setShowItems(!showItems);
    setFilteredItems(itemsList);
  };

  const assignSelectValue = async (vendor) => {
    const {
      firstName,
      lastName,
      billingAddress,
      billingContactNumber,
      billingCity,
      billingState,
      billingZipOrPostalCode,
      billingStateIso,
      paymentTerms,
    } = vendor;

    formValues.current = {
      ...formValues.current,
      vendor: firstName + " " + lastName,
      billingContactNumber,
      billingAddress,
      billingCity,
      billingState,
      billingZipOrPostalCode,
      billingStateIso,
      terms: paymentTerms,
    };

    billingAddressValues.current = {
      billingContactNumber,
      billingAddress,
      billingCity,
      billingState,
      billingZipOrPostalCode,
      billingStateIso,
    };

    handleGetCities(billingStateIso);
    setSelectedVendor(vendor);
    setInputValue(firstName + " " + lastName);
    setFormAddress((prev) => ({
      ...prev,
      ...billingAddressValues.current,
    }));

    const inp_select = document.getElementById("inp-select-list");
    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleClone = (item, cloning) => {
    setAddNewLine(false);
    !cloning && handleItemsInputClick("inp-item-list");
    let commonAdds;

    if (item.stockQuantity !== null && item.stockQuantity >= 0) {
      commonAdds = {
        selectedUnit: item?.unit?.unitType,
        selectedUnitType: "primaryUnit",
        selectedRetailPrice: item?.retailPrice,
        selectedQuantity: 1,
        stockQuantity: item.stockQuantity - item.primaryUnitQuantity,
      };
    } else {
      commonAdds = {
        selectedUnit: item?.unit?.unitType,
        selectedUnitType: "primaryUnit",
        selectedRetailPrice: item?.retailPrice,
        selectedQuantity: 1,
      };
    }

    if (itemDetails.length) {
      // implementing new cloning technique
      const exist = itemDetails.filter(
        (x) => x._id === item._id || x._id === item?.originalId
      );
      if (cloning || exist?.length) {
        const stock = stockManager.current.items.map((x) => {
          if (x._id === item._id || x._id === item.originalId) {
            return { ...x, stockLeft: x.stockLeft - item.primaryUnitQuantity };
          }
          return x;
        });

        stockManager.current.items = stock;

        let id = typeof item._id === "number" ? item.originalId : item._id;
        const randomInt = Math.floor(Math.random() * 100000);
        let objCopy = {
          ...item,
          _id: randomInt,
          originalId: id,
          ...commonAdds,
        };

        setItemDetails([...itemDetails, objCopy]);
      } else {
        if (item.stockQuantity !== null && item.stockQuantity >= 0) {
          const foundIndex = stockManager.current.items.findIndex(
            (x) => x._id === item._id
          );

          if (foundIndex !== -1) {
            stockManager.current.items[foundIndex].stockLeft -=
              item.primaryUnitQuantity;
          } else {
            // stockManager.current.items.push({
            //   _id: item._id,
            //   stockLeft: item.stockQuantity - item.primaryUnitQuantity,
            // });
            stockManager.current.items = [
              ...stockManager.current.items,
              {
                _id: item._id,
                stockLeft: item.stockQuantity - item.primaryUnitQuantity,
              },
            ];
          }
        }

        setItemDetails([...itemDetails, { ...item, ...commonAdds }]);
      }
    } else {
      if (item.stockQuantity !== null && item.stockQuantity >= 0) {
        const foundIndex = stockManager.current.items.findIndex(
          (x) => x._id === item._id
        );

        if (foundIndex !== -1) {
          stockManager.current.items[foundIndex].stockLeft -=
            item.primaryUnitQuantity;
        } else {
          stockManager.current.items = [
            ...stockManager.current.items,
            {
              _id: item._id,
              stockLeft: item.stockQuantity - item.primaryUnitQuantity,
            },
          ];
        }
      }

      setItemDetails([
        {
          ...item,
          ...commonAdds,
        },
      ]);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleDropdown = (value) => {
    setDiscountOptions(value);
    toggleDropdown();
  };

  const calculateTotal = () => {
    let total = 0;
    let tax = 0;
    if (!itemDetails?.length) {
      return;
    }
    itemDetails?.length &&
      itemDetails?.forEach((x) => {
        total += x.selectedQuantity * Number(x.selectedRetailPrice);
        if (x.tax) {
          tax +=
            (x.selectedRetailPrice *
              x.selectedQuantity *
              x.taxDetails[0].rate) /
            100;
        }
      });

    setSubtotal(total + tax);

    if (discountOptions === "%") {
      const discountRate = (total * discountInputValue) / 100;
      setDiscount(discountRate);
      total -= discountRate;
    } else {
      setDiscount(discountInputValue);
      total -= discountInputValue;
    }

    const { tcs } = formValues.current;

    if (tcs) {
      total += ((total + tax) * tcs.rate) / 100;
    }

    setTotal(total + tax);
  };

  const handleAssignValuesToEditItems = (item) => {
    if (item) {
      setSelectedEditItem(item);

      editItemsFormValues.current = {
        itemName: item.itemName,
        retailPrice: item.retailPrice,
        itemDescription: item.itemDescription,
      };
    }

    setOpen(!open);
  };

  const handleSubmitEditItem = async (selectedEditItem) => {
    try {
      await itemSchema.validate(editItemsFormValues.current, {
        abortEarly: false,
      });
      const formData = new FormData();
      Object.keys(editItemsFormValues.current).forEach((key) => {
        formData.append(key, editItemsFormValues.current[key]);
      });
      let id =
        typeof selectedEditItem._id === "number"
          ? selectedEditItem.originalId
          : selectedEditItem._id;
      formData.append("id", id);

      const object = Object.fromEntries(formData.entries());
      const data = await editItem(object);

      const items = itemsList.map((x) => {
        if (data[0]._id === x._id) {
          return data[0];
        }
        if (x.originalId === data[0]._id) {
          return { ...data[0], _id: x._id };
        }
        return x;
      });

      const items2 = itemDetails.map((x) => {
        if (x._id === data[0]._id) {
          if (x.stockQuantity !== null && x.stockQuantity >= 0) {
            return {
              ...data[0],
              selectedUnit: x.selectedUnit,
              selectedUnitType: x.selectedUnitType,
              selectedRetailPrice: x.selectedRetailPrice,
              selectedQuantity: x.selectedQuantity,
              stockQuantity: x.stockQuantity,
            };
          } else {
            return {
              ...data[0],
              selectedUnit: x.selectedUnit,
              selectedUnitType: x.selectedUnitType,
              selectedRetailPrice: x.selectedRetailPrice,
              selectedQuantity: x.selectedQuantity,
            };
          }
        }
        if (x.originalId === data[0]._id) {
          if (x.stockQuantity !== null && x.stockQuantity >= 0) {
            return {
              ...data[0],
              _id: x._id,
              selectedUnit: x.selectedUnit,
              selectedUnitType: x.selectedUnitType,
              selectedRetailPrice: x.selectedRetailPrice,
              selectedQuantity: x.selectedQuantity,
              stockQuantity: x.stockQuantity,
            };
          } else {
            return {
              ...data[0],
              _id: x._id,
              selectedUnit: x.selectedUnit,
              selectedUnitType: x.selectedUnitType,
              selectedRetailPrice: x.selectedRetailPrice,
              selectedQuantity: x.selectedQuantity,
            };
          }
        }
        return x;
      });

      setItemDetails(items2);
      dispatch(setItem({ data: items, itemCounts: 0 }));
      setOpen(false);
    } catch (error) {
      const validationErrors = {};
      console.log(error);
      error.inner.forEach((innerError) => {
        validationErrors[innerError.path] = innerError.message;
      });
      setEditItemFormErrors(validationErrors);
    }
  };

  const handleChangeItemRate = (id, selectedRetailPrice) => {
    const items = itemDetails?.map((x) => {
      if (x._id === id) {
        return { ...x, selectedRetailPrice };
      }
      return x;
    });

    setItemDetails(items);
  };

  // temporary closed !!
  // const handleChangeItemType = (id) => {
  //   const items = itemDetails.map((x) => {
  //     if (x._id === id) {
  //       const temp = x.retailPrice;
  //       return {
  //         ...x,
  //         retailPrice: x.secondaryUnitPrice,
  //         secondaryUnitPrice: temp,
  //       };
  //     }

  //     return x;
  //   });

  //   setItemDetails(items);
  //   handleDropdown(id);
  // };

  const handlePrintOrPreview = () => {
    generatePdf(formValues, "Bill");
    setOpenPrintOrPreview(true);
  };

  const handleChangeBillingAddressInput = async (event) => {
    const { name, value } = event.target;
    billingAddressValues.current = {
      ...billingAddressValues.current,
      [name]: value,
    };

    try {
      await Yup.reach(billingAddressSchema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleSubmitBillingAddressChange = async (e) => {
    try {
      e.preventDefault();
      await billingAddressSchema.validate(formAddress, {
        abortEarly: false,
      });
      const formData = new FormData();
      Object.keys(formAddress).forEach((key) => {
        formData.append(key, formAddress[key]);
      });
      formData.append("_id", selectedVendor?._id);
      const object = Object.fromEntries(formData.entries());

      const data = await changeBillingAddress(object);

      if (data) {
        const list = vendorsList.map((x) => {
          if (x._id === data._id) {
            return data;
          }
          return x;
        });
        formValues.current = {
          ...formValues.current,
          billingContactNumber: data?.billingContactNumber,
          billingAddress: data?.billingAddress,
          billingCity: data?.billingCity,
          billingState: data?.billingState,
          billingZipOrPostalCode: data?.billingZipOrPostalCode,
          billingStateIso: data?.billingStateIso,
        };
        setFormErrors({
          ...formErrors,
          billingAddress: null,
        });
        dispatch(setVendor(list));
        setEditAddress(false);
      } else {
        setFormErrors({
          ...formErrors,
          billingAddress: "Billing address not changed",
        });
      }
    } catch (error) {
      console.log(error);
      const validationErrors = {};
      error.inner.forEach((innerError) => {
        validationErrors[innerError.path] = innerError.message;
      });
      setFormErrors(validationErrors);
    }
  };

  const handleItemTaxChange = (e, item) => {
    const { value } = e.target;
    const findTax = taxes?.taxes?.filter((x) => x._id === value);

    const modifiedItems = itemDetails?.map((x) => {
      if (x._id === item._id) {
        if (value === "Non-Taxable")
          return {
            ...item,
            taxDetails: findTax,
            tax: null,
            taxPreference: value,
          };
        return {
          ...item,
          taxDetails: findTax,
          tax: value,
          taxPreference: "Taxable",
        };
      }
      return x;
    });

    setItemDetails(modifiedItems);
  };

  const handleChangeUnitType = (unitType, item, stock, idx) => {
    if (unitType === "primaryUnit") {
      if (item.selectedUnitType === unitType) {
        handleDropdown(idx);
        return;
      }
      if (item.stockQuantity !== null) {
        const findUnit = item.stockConversion.filter(
          (x) => x.secondaryUnit === item.selectedUnit
        );
        const newStock = stockManager.current.items.map((x) => {
          if (x._id === item._id || x._id === item.originalId) {
            return {
              ...x,
              stockLeft:
                x.stockLeft +
                findUnit[0]?.numberOfSecondaryUnit * item.selectedQuantity -
                item.primaryUnitQuantity * item.selectedQuantity,
            };
          }
          return x;
        });
        stockManager.current.items = newStock;
      }

      const items = itemDetails?.map((x) => {
        if (x._id === item._id) {
          return {
            ...x,
            selectedUnit: x.unit.unitType,
            selectedUnitType: unitType,
            selectedRetailPrice: x.retailPrice,
          };
        }
        return x;
      });

      setItemDetails(items);
    }
    if (unitType === "secondaryUnit") {
      if (item.selectedUnitType === "primaryUnit") {
        if (item.stockQuantity !== null) {
          const newStock = stockManager.current.items.map((x) => {
            if (x._id === item._id || x._id === item.originalId) {
              return {
                ...x,
                stockLeft:
                  x.stockLeft +
                  item.primaryUnitQuantity * item.selectedQuantity -
                  stock.numberOfSecondaryUnit * item.selectedQuantity,
              };
            }
            return x;
          });
          stockManager.current.items = newStock;
        }
      } else {
        if (item.stockQuantity !== null) {
          const findUnit = item.stockConversion.filter(
            (x) => x.secondaryUnit === item.selectedUnit
          );
          const newStock = stockManager.current.items.map((x) => {
            if (x._id === item._id || x._id === item.originalId) {
              return {
                ...x,
                stockLeft:
                  x.stockLeft +
                  findUnit[0]?.numberOfSecondaryUnit * item.selectedQuantity -
                  stock.numberOfSecondaryUnit * item.selectedQuantity,
              };
            }
            return x;
          });
          stockManager.current.items = newStock;
        }
      }

      const items = itemDetails?.map((x) => {
        if (x._id === item._id) {
          return {
            ...x,
            selectedUnit: stock.secondaryUnit,
            selectedUnitType: unitType,
            selectedRetailPrice: stock.unitPrice,
          };
        }
        return x;
      });

      setItemDetails(items);
    }

    handleDropdown(idx);
  };

  const handleChangeTcs = (tax) => {
    formValues.current.tcs = tax;
    setTcsInputValue(tax.taxName);
  };

  const handleStockQuantity = (bill) => {
    const list = [];
    itemsList.forEach((x) => {
      bill.itemDetails.forEach((y) => {
        if (x._id === y._id || x._id === y.originalId) {
          list.push({ ...y, stockQuantity: x.stockQuantity });

          if (x.stockQuantity !== null) {
            if (stockManager.current.items.length) {
              const exist = stockManager.current.items.filter(
                (z) => x._id === z._id
              );

              if (!exist.length) {
                stockManager.current.items.push({
                  _id: x._id,
                  stockLeft: x.stockQuantity,
                });
              }
            } else {
              stockManager.current.items = [
                {
                  _id: x._id,
                  stockLeft: x.stockQuantity,
                },
              ];
            }
          }
        }
        // else the item is not in the shop
      });
    });
  };

  const handleGetStateAndCity = async () => {
    if (countryCode) {
      const selectedState = State.getStatesOfCountry(countryCode);
      const selectedCountry = Country.getCountryByCode(countryCode);
      setStateList(selectedState);
      setCountry(selectedCountry);
    }
  };

  const handleGetCities = (billingStateIso) => {
    if (country)
      setCityList(City.getCitiesOfState(country?.isoCode, billingStateIso));
  };

  const handleFilteringStateAndCity = (e, type) => {
    if (!editAddress) return;
    const { value } = e.target;

    const cityOrState = type === "state" ? stateList : cityList;

    const filtered = cityOrState?.filter((option) => {
      const { name } = option;
      return name.toLowerCase().includes(value.toLowerCase());
    });

    if (type === "state") {
      formValues.current = {
        ...formValues.current,
        billingCity: "",
        billingState: "",
      };

      billingAddressValues.current = {
        ...billingAddressValues.current,
        billingState: value,
      };

      setFormAddress((prev) => ({
        ...prev,
        billingCity: "",
        billingState: "",
      }));

      setFilteredStateList(filtered);
    }

    if (type === "city") {
      formValues.current = {
        ...formValues.current,
        billingCity: "",
      };
      billingAddressValues.current = {
        ...billingAddressValues.current,
        billingCity: value,
      };

      setFormAddress((prev) => ({
        ...prev,
        billingCity: "",
      }));

      setFilteredCityList(filtered);
    }
  };

  const handleChangeCityOrState = (inpId, cityOrState, type) => {
    if (editAddress) {
      const { name, isoCode } = cityOrState;

      if (type === "state") {
        billingAddressValues.current = {
          ...billingAddressValues.current,
          billingCity: "",
          billingState: name,
          billingStateIso: isoCode,
        };
        setFormAddress((prev) => ({
          ...prev,
          billingCity: "",
          billingState: name,
          billingStateIso: isoCode,
        }));

        handleGetCities(isoCode);
      }

      if (type === "city") {
        billingAddressValues.current = {
          ...billingAddressValues.current,
          billingCity: name,
        };

        setFormAddress((prev) => ({
          ...prev,
          billingCity: name,
        }));
      }

      handleAddressInputClick(inpId);
    }
  };

  const handleAddressInputClick = (inpId, type) => {
    if (!editAddress) return;

    const inp_select = document.getElementById(inpId);
    if (type === "city") setFilteredCityList(cityList);
    if (type === "state") setFilteredStateList(stateList);

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  useEffect(() => {
    (async () => {
      const bills = await getAllBills();
      const data = await getAddNewBill();

      const {
        vendors,
        items,
        taxes,
        profile: { countryCode },
        lastBill,
      } = data;

      dispatch(setBill(bills));
      dispatch(setTax(taxes));
      dispatch(setVendor(vendors));
      dispatch(setItem(items));
      dispatch(setLastBill(lastBill));
      dispatch(setCountryCode(countryCode));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (countryCode) {
      handleGetStateAndCity();
    }
  }, [countryCode]);

  useEffect(() => {
    if (id && billsList?.length && itemsList?.length) {
      const list = billsList?.filter((x) => x._id === id);
      const billDate = dayjs(new Date(list[0]?.billDate));
      const expiryDate = dayjs(new Date(list[0]?.expiryDate));
      formValues.current = { ...list[0], billDate, expiryDate };
      billingAddressValues.current = {
        ...list[0],
        billDate,
        expiryDate,
      };

      handleGetCities(list[0]?.billingStateIso);

      setFormAddress({ ...billingAddressValues.current });
      setSelectedBill(list);
      setItemDetails(list[0]?.itemDetails);
      setInputValue(list[0]?.vendor);
      setDiscount(list[0]?.discount);
      setDiscountInputValue(list[0]?.discount);
      setBillDate(billDate);
      setExpiryDate(expiryDate);
      setSelectedVendor({ _id: list[0]?.vendorId });

      if (list[0]?.tcs) {
        setTcsInputValue(list[0]?.tcs?.taxName);
      }

      handleStockQuantity(list[0]);
    }
  }, [id, billsList, itemsList]);

  useEffect(() => {
    calculateTotal();
  }, [itemDetails, discountInputValue, tcsInputValue]);

  useEffect(() => {
    if (stockManager.current.items.length) {
      stockManager.current.items.map((x) => {
        const require = document.getElementById(x._id);
        if (x.stockLeft !== null && x.stockLeft < 0) {
          require?.classList?.remove("tw-collapse");
          setOutOfStockError((prev) => ({ ...prev, [x._id]: true }));
        } else {
          require?.classList?.add("tw-collapse");
          setOutOfStockError((prev) => ({ ...prev, [x._id]: false }));
        }
      });
    }
  }, [stockManager.current.items]);

  return (
    <div className="tw-relative tw-mt-16 tw-min-h-screen tw-bg-white tw-select-none">
      {/* section header starting from here */}
      <SubNavBar
        leftText={`${id ? "Edit bill" : "Create new bill"}`}
        rightText={"Print or Preview"}
        buttons={buttons}
        fullBorder={true}
        clickEvent={handlePrintOrPreview}
      />
      {/* section header starting ending */}

      {/* { add new customer modal starting} */}

      <ModalComponent
        title={"Add new vendor"}
        onClose={(e) => setShowAddCustomer(false)}
        open={showAddCustomer}
        fade={showAddCustomer}
        style={{ ...baseStyle2, ...modal2Style3 }}
      >
        <AddNewCustomerModal
          customers={vendorsList}
          onClose={setShowAddCustomer}
          setFilteredCustomer={setFilteredOptions}
        />
      </ModalComponent>

      {/* { add new customer modal ending} */}

      {/* form staring */}
      <form className="tw-px-14 tw-py-8 tw-mt-12 tw-bg-white tw-border-b">
        {showAlert && (
          <div className="tw-relative tw-z-50">
            <div
              className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-absolute tw-w-full"
              role="alert"
            >
              <strong className="tw-font-bold">
                There were errors with your submission!
              </strong>
              <span className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-px-4 tw-py-3">
                <svg
                  onClick={() => setShowAlert(false)}
                  className="tw-fill-current tw-h-6 tw-w-6 tw-text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </span>
            </div>
          </div>
        )}
        <div className="tw-grid md:tw-grid-cols-11 md:tw-grid-flow-row tw-gap-10">
          <div className="tw-col-span-4">
            {/* Vendor_input  */}
            <div className="tw-pb-4">
              <label>Vendor</label>
              <div className="relative">
                <input
                  id="inp-select"
                  autoComplete="off"
                  name={"vendor"}
                  onClick={() => handleInputClick("inp-select-list")}
                  className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                    formErrors.vendor
                      ? "tw-border tw-border-[#FF0000]"
                      : "tw-border tw-border-[#0000003b]"
                  }`}
                  type="text"
                  placeholder="Select Vendor"
                  value={inputValue}
                  onChange={(e) => handleFiltering(e)}
                />
                <span className="tw-relative tw-z-0">
                  <BiSearch className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                </span>
                <span className="tw-relative tw-z-0">
                  <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                </span>
                <div className="tw-relative">
                  {filteredOptions?.length > 0 && (
                    <ul
                      id="inp-select-list"
                      className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                    >
                      {filteredOptions.map((clients, idx) => (
                        <li
                          key={idx}
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white tw-text-xs tw-font-Manrope"
                          onClick={(e) => assignSelectValue(clients)}
                        >
                          {clients.firstName + " " + clients.lastName}
                        </li>
                      ))}
                      <li
                        onClick={() => setShowAddCustomer(true)}
                        className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF] tw-text-xs tw-font-Manrope"
                      >
                        <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add
                        new vendor
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <label className="tw-mb-[6px]">
              {formErrors?.billDate ? formErrors.billDate : "Bill date"}
            </label>
            <div className="tw-pb-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={billDate}
                  onChange={(date) => handleDateChange(date, "billDate")}
                  className="tw-w-full"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 27,
                      border: formErrors.billDate ? "1px solid #FF0000" : "",
                      fontSize: 12,
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#8153E2",
                      fontSize: 20,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            {/* {Order number} */}
            <div className="tw-pb-4">
              <Input
                name={"orderNumber"}
                value={formValues?.current?.orderNumber}
                type={"number"}
                label={"Order Number"}
                onChange={handleInputChange}
                errorMessage={formErrors.orderNumber}
                style={{
                  border: formErrors.orderNumber
                    ? "1px solid #FF0000"
                    : " 1px solid #0000003b",
                  height: "27px",
                  fontSize: "12px",
                }}
              />
            </div>

            {/* Billing address */}
            <div className="tw-relative">
              <div className="tw-absolute tw-right-0 tw-inline-flex tw-items-center">
                <label htmlFor="edit">Edit</label>
                <input
                  title={"Note: Please make sure to save after editing"}
                  type="checkbox"
                  onChange={() => setEditAddress(!editAddress)}
                  style={{
                    width: "15px",
                    height: "15px",
                    cursor: "pointer",
                    marginLeft: "5px",
                  }}
                  checked={editAddress}
                />
              </div>
            </div>
            <TextArea
              onChange={handleChangeBillingAddressInput}
              name="billingAddress"
              label={"Billing Address"}
              errorMessage={formErrors.billingAddress}
              value={
                !editAddress
                  ? formValues?.current?.billingAddress
                  : billingAddressValues?.current?.billingAddress
              }
              placeholder={"Address"}
              style={{
                border: formErrors.billingAddress
                  ? "1px solid #FF0000"
                  : "1px solid #0000003b",
                fontSize: "12px",
              }}
              disabled={!editAddress}
            />
          </div>

          <div className="tw-col-span-7 tw-pr-14">
            <div className="tw-flex">
              <div className="tw-w-[60%] tw-pb-4">
                <label>Bill #</label>
                <input
                  name="bill"
                  className={`tw-h-[27px] tw-mt-[6px] tw-text-[12px] tw-border tw-border-[#0000003b]`}
                  type="text"
                  placeholder="PSO-0001"
                  value={
                    id
                      ? lastBill[0]?.bill
                        ? "BIL-" +
                          parseInt(lastBill[0]?.bill, 10)
                            .toString()
                            .padStart(lastBill[0]?.bill.length, "0")
                        : "BIL-0001"
                      : lastBill[0]?.bill
                      ? "BIL-" +
                        (parseInt(lastBill[0]?.bill, 10) + 1)
                          .toString()
                          .padStart(lastBill[0]?.bill.length, "0")
                      : "BIL-0001"
                  }
                />
                <span className="tw-relative tw-z-0">
                  <IoMdSettings className="tw-absolute tw-bottom-[2px] tw-left-[-28px] tw-text-[#8153E2] tw-z-40" />
                </span>
              </div>
              <div className="tw-w-[40%] tw-pt-[24px]">
                {/* Status_input */}
                <div className="tw-ml-5 tw-mb-4">
                  <SelectDropDown
                    name={"status"}
                    value={formValues?.current?.status}
                    onChange={handleInputChange}
                    errorMessage={formErrors.status}
                    style={{
                      border: formErrors.status ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  >
                    {status.map((status) => (
                      <MenuItem value={status.value}>{status.value}</MenuItem>
                    ))}
                  </SelectDropDown>
                </div>
              </div>
            </div>

            {/* Expiry_date_input */}
            <div className="tw-flex">
              <div className="tw-w-[270px]">
                <label className="tw-mb-[6px]">
                  {formErrors?.expiryDate
                    ? formErrors.expiryDate
                    : "Expiry date"}
                </label>
                <div className="Expiry_date_input ">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      onChange={(date) => handleDateChange(date, "expiryDate")}
                      value={expiryDate}
                      className={`tw-w-full`}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 27,
                          border: formErrors.expiryDate
                            ? "1px solid #FF0000"
                            : "",
                          fontSize: 12,
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#8153E2",
                          fontSize: 20,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="tw-w-[270px] tw-ml-5">
                <SelectDropDown
                  label={"Terms"}
                  name={"terms"}
                  value={
                    formValues?.current?.terms ? formValues?.current?.terms : ""
                  }
                  onChange={handleInputChange}
                  errorMessage={formErrors.terms}
                  style={{
                    border: formErrors.terms ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                    height: "27px",
                    "margin-top": 0,
                  }}
                >
                  {paymentTerms.map((x) => (
                    <MenuItem value={x.value}>{x.value}</MenuItem>
                  ))}
                </SelectDropDown>
              </div>
            </div>

            {/* last four inputs */}
            <div className="tw-flex tw-py-4 tw-mt-[91px] tw-gap-5">
              <div className="relative tw-w-3/6">
                <input
                  autoComplete="off"
                  value={
                    !editAddress
                      ? formValues?.current?.billingCity
                      : billingAddressValues?.current?.billingCity
                  }
                  placeholder="City"
                  onClick={() =>
                    handleAddressInputClick("billing__city", "city")
                  }
                  onChange={(e) => handleFilteringStateAndCity(e, "city")}
                  className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                    formErrors.billingCity
                      ? "tw-border tw-border-[#FF0000]"
                      : "tw-border tw-border-[#0000003b]"
                  }`}
                  type="text"
                  disabled={!editAddress}
                />
                <span className="tw-relative tw-z-0">
                  <IoIosArrowDown className="tw-absolute tw-top-[6px] -tw-left-7 tw-text-[#8153E2] tw-z-40" />
                </span>
                <div className="tw-relative">
                  {filteredCityList.length > 0 && (
                    <ul
                      id="billing__city"
                      className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-0 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                    >
                      {filteredCityList.map((city) => (
                        <li
                          onClick={() =>
                            handleChangeCityOrState(
                              "billing__city",
                              city,
                              "city"
                            )
                          }
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                        >
                          {city.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="relative tw-w-3/6">
                <input
                  autoComplete="off"
                  value={
                    !editAddress
                      ? formValues?.current?.billingState
                      : billingAddressValues?.current?.billingState
                  }
                  placeholder="State"
                  onClick={() =>
                    handleAddressInputClick("billing__state", "state")
                  }
                  onChange={(e) => handleFilteringStateAndCity(e, "state")}
                  className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                    formErrors.billingState
                      ? "tw-border tw-border-[#FF0000]"
                      : "tw-border tw-border-[#0000003b]"
                  }`}
                  type="text"
                  disabled={!editAddress}
                />
                <span className="tw-relative tw-z-0">
                  <IoIosArrowDown className="tw-absolute tw-top-[6px] -tw-left-7 tw-text-[#8153E2] tw-z-40" />
                </span>
                <div className="tw-relative">
                  {filteredStateList.length > 0 && (
                    <ul
                      id="billing__state"
                      className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-10 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                    >
                      {filteredStateList.map((state) => (
                        <li
                          onClick={() =>
                            handleChangeCityOrState(
                              "billing__state",
                              state,
                              "state"
                            )
                          }
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                        >
                          {state.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="tw-flex tw-mt-1 tw-gap-5">
              <div className="tw-w-3/6">
                <Input
                  name={"billingZipOrPostalCode"}
                  value={
                    !editAddress
                      ? formValues?.current?.billingZipOrPostalCode
                      : billingAddressValues?.current?.billingZipOrPostalCode
                  }
                  placeholder={"Zip Code"}
                  type={"number"}
                  onChange={handleChangeBillingAddressInput}
                  errorMessage={formErrors.billingZipOrPostalCode}
                  style={{
                    border: formErrors.billingZipOrPostalCode
                      ? "1px solid #FF0000"
                      : "1px solid #0000003b",
                    height: "27px",
                    fontSize: "12px",
                  }}
                  disabled={!editAddress}
                />
              </div>
              <div className="tw-w-3/6">
                <Input
                  value={
                    !editAddress
                      ? formValues?.current?.billingContactNumber
                      : billingAddressValues?.current?.billingContactNumber
                  }
                  name={"billingContactNumber"}
                  placeholder={"Contact Number"}
                  onChange={handleChangeBillingAddressInput}
                  errorMessage={formErrors.billingContactNumber}
                  style={{
                    border: formErrors.billingContactNumber
                      ? "1px solid #FF0000"
                      : "1px solid #0000003b",
                    height: "27px",
                    fontSize: "12px",
                  }}
                  disabled={!editAddress}
                />
              </div>
            </div>
            {selectedVendor && editAddress && (
              <div className="tw-flex tw-justify-end tw-px-14 tw-pt-4">
                <button
                  onClick={handleSubmitBillingAddressChange}
                  className="tw-px-3 tw-h-8 tw-py-1 tw-mr-4 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* form ending */}

      {/* {modal for print or preview starting} */}

      <ModalComponent
        title={"Print or Preview"}
        onClose={(e) => setOpenPrintOrPreview(false)}
        open={openPrintOrPreview}
        fade={openPrintOrPreview}
        style={{ ...baseStyle2, ...modal2Style2 }}
      >
        <iframe id="pdf-preview"></iframe>
      </ModalComponent>

      {/* {modal for print or preview ending} */}

      {/* table starting */}
      <div id="pdf-content" className="tw-px-14 tw-bg-white tw-py-8">
        <table id="my-table" className="tw-w-full tw-text-sm tw-text-left">
          <thead className="tw-border-b">
            <tr>
              <th
                scope="col"
                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-end tw-max-w-lg"
              >
                #
              </th>
              <th
                scope="col"
                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-start"
              >
                ITEM DETAILS
              </th>
              <th
                scope="col"
                className="tw-px-4 tw-w-28 tw-pt-2 tw-border-r tw-text-xs tw-text-end"
              >
                QTY
              </th>
              <th
                scope="col"
                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-end"
              >
                RATE
              </th>
              <th
                scope="col"
                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-end"
              >
                TAX
              </th>
              <th
                scope="col"
                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-end"
              >
                AMOUNT
              </th>
              <th scope="col" className="tw-px-4 tw-pt-2"></th>
            </tr>
          </thead>
          <tbody>
            {itemDetails &&
              itemDetails?.map((x, idx) => (
                <tr key={idx} className="tw-bg-white tw-border-b">
                  <td className="tw-border-r tw-w-14">
                    <div className="tw-flex tw-justify-center tw-items-center tw-pb-7 tw-text-violet-700">
                      <RxDragHandleDots2 className="tw-inline tw-text-base tw-font-Manrope tw-mr-1.5" />
                      {idx < 9 ? (
                        <>
                          <span span className="tw-text-xs tw-font-Manrope">
                            0{idx + 1}
                          </span>
                        </>
                      ) : (
                        <>
                          <span span className="tw-text-xs tw-font-Manrope">
                            {idx + 1}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="tw-pt-3 tw-pl-3 tw-border-r">
                    {x?.itemName && (
                      <>
                        <div className="tw-flex tw-justify-between">
                          <span className="tw-text-[#545357] tw-text-[12.5] tw-font-Poppins">
                            {x?.itemName}
                          </span>
                          <span className="tw-rounded-full tw-w-4 tw-h-4 tw-border tw-border-[#828087] tw-flex tw-items-center tw-mr-1">
                            <MdOutlineEdit
                              onClick={(e) => handleAssignValuesToEditItems(x)}
                              className="tw-text-[#828087] tw-w-full tw-h-full tw-p-px"
                            />
                          </span>
                        </div>
                        <span className="tw-text-[10px] tw-text-[#828087] tw-font-Poppins">
                          {x?.itemDescription}
                        </span>
                        <div className="tw-flex tw-mb-0.5 tw-items-center tw-h-5">
                          <span className="tw-bg-violet-700 tw-rounded-[3px] tw-flex tw-items-center tw-h-3">
                            <h6 className="tw-w-10 tw-text-[9px] tw-text-center tw-text-white tw-font-thin tw-font-Manrope">
                              Goods
                            </h6>
                          </span>
                          {country && country.name === "India" && (
                            <>
                              <h5 className="tw-text-[9px] tw-ml-1 tw-text-[#545357] tw-font-Manrope">
                                HSN Code
                              </h5>
                              <span className="tw-rounded-full tw-border tw-border-[#828087] tw-ml-1 tw-w-3 tw-h-3 tw-flex tw-items-center">
                                <MdOutlineEdit className="tw-text-[#828087] tw-p-0.5" />
                              </span>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </td>
                  <td className=" tw-border-r">
                    <div className="tw-flex tw-justify-center tw-items-center tw-pb-2">
                      <AiOutlineMinus
                        onClick={() => handleQuantity(-1, x)}
                        className="tw-cursor-pointer "
                      />
                      <input
                        disabled
                        type="text"
                        className="tw-w-10 tw-h-6 tw-mr-3 tw-ml-3 tw-border tw-border-[#0000003b]"
                        value={x?.selectedQuantity ? x.selectedQuantity : 0}
                      />
                      <AiOutlinePlus
                        onClick={() => handleQuantity(+1, x)}
                        className="tw-cursor-pointer "
                      />
                    </div>
                    <div className="tw-text-right tw-pr-4">
                      <span
                        className={`tw-cursor-pointer ${
                          outOfStockError?.[x?._id]
                            ? "tw-text-red-500"
                            : "tw-text-violet-700"
                        }`}
                        onClick={() => handleDropdown(idx)}
                      >
                        {x.selectedUnit ? x.selectedUnit : "no data"}
                      </span>
                      <span
                        id={x?._id}
                        className="tw-block tw-collapse tw-text-xs tw-h-2 tw-text-red-500 tw-font-Poppins"
                      >
                        {outOfStockError?.[x?._id] && "Out of stock"}
                      </span>
                      <div className="tw-relative">
                        <ul
                          id={idx}
                          className="tw-hidden tw-absolute tw-right-0 tw-top-3 tw-z-20 tw-w-32 tw-bg-white tw-shadow-lg tw-rounded-md"
                        >
                          <li
                            onClick={() =>
                              handleChangeUnitType("primaryUnit", x, null, idx)
                            }
                            className={`tw-text-xs tw-cursor-pointer tw-text-start tw-text-black hover:tw-bg-[#8153E2] hover:tw-text-white tw-p-2 tw-pl-4 tw-rounded-t-md tw-font-Manrope`}
                          >
                            {x.unit ? x?.unit?.unitType : "can't fetch"}
                          </li>

                          {x.stockConversion &&
                            x.stockConversion.map((y, inx) => (
                              <li
                                onClick={() =>
                                  handleChangeUnitType(
                                    "secondaryUnit",
                                    x,
                                    y,
                                    idx
                                  )
                                }
                                className={`tw-text-xs tw-cursor-pointer tw-h-8 tw-text-start tw-text-black hover:tw-bg-[#8153E2] hover:tw-text-white tw-p-2 tw-pl-4 ${
                                  inx === x?.stockConversion?.length - 1 &&
                                  "tw-rounded-b-md"
                                }`}
                              >
                                {y.secondaryUnit}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </td>
                  <td className="tw-border-r tw-w-36">
                    <div className="tw-pb-8 tw-flex tw-justify-end tw-px-3">
                      <input
                        type="number"
                        onChange={(e) =>
                          handleChangeItemRate(x._id, e.target.value)
                        }
                        value={x?.selectedRetailPrice && x.selectedRetailPrice}
                        className="tw-h-[25px] tw-border-none tw-outline-none tw-text-right"
                        autoComplete="off"
                      />
                    </div>
                  </td>
                  <td className="tw-px-3 tw-border-r tw-w-36">
                    <div className="tw-pb-7">
                      <SelectDropDown
                        name={"itemTax"}
                        value={
                          x?.taxDetails[0]?._id
                            ? x.taxDetails[0]._id
                            : "Non-Taxable"
                        }
                        onChange={(e) => handleItemTaxChange(e, x)}
                        style={{
                          fontSize: "12px",
                          height: "23px",
                          width: "110px",
                        }}
                      >
                        {taxes?.taxes &&
                          taxes?.taxes?.map((tax) => (
                            <MenuItem value={tax._id}>{tax.taxName}</MenuItem>
                          ))}
                        <MenuItem value={"Non-Taxable"}>Non-Taxable</MenuItem>
                      </SelectDropDown>
                    </div>
                  </td>
                  <td className="tw-border-r tw-w-36">
                    <div id={x._id} className="tw-pb-7 tw-text-end tw-px-4">
                      {x.taxPreference === "Taxable"
                        ? (x.selectedRetailPrice *
                            x.selectedQuantity *
                            x.taxDetails[0].rate) /
                            100 +
                          x.selectedRetailPrice * x.selectedQuantity +
                          ".00"
                        : x.selectedRetailPrice * x.selectedQuantity}
                    </div>
                  </td>
                  <td className="tw-w-14">
                    <div className="tw-flex tw-justify-center tw-pb-7">
                      <MdOutlineDelete
                        onClick={() => handleDelete(x)}
                        className="tw-inline tw-text-lg tw-cursor-pointer"
                      />
                      <MdContentCopy
                        onClick={() => handleClone(x, true)}
                        className="tw-inline tw-mt-0.5 tw-ml-2 tw-cursor-pointer"
                      />
                    </div>
                  </td>
                  {/* {modal for edit item starting} */}
                  <ModalComponent
                    title={"Edit item"}
                    onClose={(e) => setOpen(false)}
                    open={open}
                    fade={open}
                    style={{ ...baseStyle, ...modal2Style }}
                  >
                    <div className="tw-px-6 tw-py-2">
                      <div className="tw-flex tw-justify-between tw-gap-2 tw-mb-2">
                        <div className="tw-w-full">
                          <Input
                            type={"text"}
                            name={"itemName"}
                            value={
                              selectedEditItem?.itemName
                                ? selectedEditItem.itemName
                                : ""
                            }
                            onChange={(e) => handleEditFormInputChange(e)}
                            placeholder={"Item name"}
                            label={"Item name"}
                            errorMessage={editItemFormErrors.itemName}
                            style={{
                              border: editItemFormErrors.itemName
                                ? "1px solid #FF0000"
                                : "",
                              fontSize: "12px",
                              width: "100%",
                            }}
                          />
                        </div>
                        <div className="tw-w-full">
                          <Input
                            value={
                              selectedEditItem?.retailPrice
                                ? selectedEditItem.retailPrice
                                : ""
                            }
                            type={"number"}
                            name={"retailPrice"}
                            onChange={(e) => handleEditFormInputChange(e)}
                            placeholder={"Item price"}
                            label={"Item price"}
                            errorMessage={editItemFormErrors.retailPrice}
                            style={{
                              border: editItemFormErrors.retailPrice
                                ? "1px solid #FF0000"
                                : "",
                              fontSize: "12px",
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>
                      <TextArea
                        value={
                          selectedEditItem?.itemDescription
                            ? selectedEditItem.itemDescription
                            : ""
                        }
                        name={"itemDescription"}
                        onChange={(e) => handleEditFormInputChange(e)}
                        placeholder={"Description"}
                        label={"Description"}
                        errorMessage={editItemFormErrors.itemDescription}
                        style={{
                          border: editItemFormErrors.itemDescription
                            ? "1px solid #FF0000"
                            : "",
                          fontSize: "12px",
                        }}
                      />

                      <div
                        style={{
                          width: "90%",
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingBlock: "1rem",
                        }}
                      >
                        <Button
                          onClick={() => handleSubmitEditItem(x)}
                          variant="contained"
                          style={{
                            backgroundColor: "#8153E2",
                            color: "white",
                            height: "25px",
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </ModalComponent>
                  {/* {modal for edit item ending} */}
                </tr>
              ))}
            {addNewLine && (
              <tr className="tw-bg-white tw-border-b">
                <td className="tw-border-r tw-w-14">
                  <div className="tw-flex tw-justify-center tw-items-center tw-pb-7 tw-text-violet-700">
                    <RxDragHandleDots2 className="tw-inline tw-text-base tw-mr-1.5" />
                    {itemDetails?.length > 0 ? (
                      itemDetails?.length < 9 ? (
                        <>
                          <span className="tw-text-xs tw-font-Manrope">
                            0{itemDetails?.length + 1}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="tw-text-xs tw-font-Manrope">
                            {itemDetails?.length + 1}
                          </span>
                        </>
                      )
                    ) : (
                      <span className="tw-text-xs tw-font-Manrope">01</span>
                    )}
                  </div>
                </td>
                <td className="tw-border-r">
                  <div className="tw-flex tw-items-start tw-pt-3 tw-h-[76px]">
                    <input
                      autoComplete="off"
                      onClick={() => handleItemsInputClick("inp-item-list")}
                      className={`tw-rounded tw-text-xs tw-h-6 tw-w-full tw-z-10 tw-border-none focus:tw-outline-none tw-font-Poppins`}
                      type="text"
                      placeholder="Type or click to select an item"
                      onChange={handleItemFiltering}
                    />
                  </div>

                  <div>
                    {showItems && filteredItems.length > 0 && (
                      <ul
                        id="inp-item-list"
                        className="tw-absolute tw-w-80 tw-bg-white tw-z-30 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48"
                      >
                        {filteredItems.map((item, idx) => (
                          <li
                            onClick={() => handleClone(item)}
                            key={idx}
                            className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                          >
                            <h3 className="tw-font-Manrope tw-text-[12.5px]">
                              {item?.itemName && item?.itemName}
                            </h3>
                            <h4 className="tw-font-Manrope tw-text-[10px]">
                              Rate: ₹{item.retailPrice}.00
                            </h4>
                          </li>
                        ))}
                        <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF] tw-text-xs tw-font-Manrope">
                          <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add
                          new item
                        </li>
                      </ul>
                    )}
                  </div>
                </td>
                <td className="tw-border-r">
                  <div className="tw-flex tw-justify-end tw-items-center tw-pb-7">
                    <input
                      disabled
                      className="tw-w-12 tw-h-6 tw-mr-3 tw-ml-3 tw-text-[#545357] tw-text-end tw-border-none tw-outline-none tw-bg-white"
                      value={"0.00"}
                    />
                  </div>
                </td>
                <td className="tw-border-r tw-w-36">
                  <div className="tw-pb-8 tw-flex tw-justify-center tw-px-3">
                    <input
                      disabled
                      value={"0.00"}
                      className="tw-h-[25px] tw-text-[#545357] tw-border-none tw-outline-none tw-text-end tw-bg-white"
                    />
                  </div>
                </td>
                <td className="tw-px-3 tw-border-r tw-w-36">
                  <div className="tw-pb-7">
                    <SelectDropDown
                      value={"tax"}
                      style={{
                        fontSize: "12px",
                        height: "23px",
                        width: "110px",
                      }}
                    ></SelectDropDown>
                  </div>
                </td>
                <td className=" tw-border-r tw-w-36">
                  <div className="tw-pb-7 tw-text-end tw-px-4 tw-text-[#545357]">
                    0.00
                  </div>
                </td>
                <td className="tw-w-14">
                  <div className="tw-flex tw-justify-center tw-pb-7">
                    <MdOutlineDelete className="tw-inline tw-text-lg tw-cursor-pointer tw-text-[#828087]" />
                    <MdContentCopy className="tw-inline tw-mt-0.5 tw-ml-2 tw-cursor-pointer tw-text-[#828087]" />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* table ending */}

      {/* bottom section */}
      <div className="tw-z-0 tw-grid md:tw-grid-cols-2 md:tw-grid-flow-row tw-pr-28 tw-bg-white tw-pb-8">
        <div className="span-col-1 tw-flex tw-justify-start tw-flex-col tw-pb-4 md:tw-pb-0">
          <div className="tw-pl-28 tw-inline-flex tw-items-start">
            <button
              onClick={(e) => setAddNewLine(true)}
              className="tw-h-6 tw-pb-5 tw-min-w-[110px] tw-max-w-[110px] tw-text-xs tw-text-center tw-rounded tw-text-violet-700 tw-p-1 tw-border tw-border-violet-700 "
            >
              <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add new line
            </button>
          </div>
          <div className="tw-pl-14 tw-mt-6 tw-z-0 tw-w-8/12">
            {/* Billing address */}
            <TextArea
              onChange={handleInputChange}
              value={formValues?.current?.notes}
              name="notes"
              label={"Notes"}
              placeholder={"Notes or terms"}
              style={{
                border: formErrors.notes
                  ? "1px solid #FF0000"
                  : "1px solid #0000003b",
                fontSize: "12px",
              }}
            />
          </div>
        </div>
        <div className="tw-span-col-1 xl:tw-pl-32 2xl:tw-pl-36">
          <div className="tw-h-6 tw-flex tw-justify-between tw-text-sm tw-pb-2">
            <span>Subtotal</span>
            <span>{subtotal}.00</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm tw-pb-2">
            <div className="tw-flex tw-justify-between">
              <span>Discount</span>
              <input
                value={discountInputValue}
                onChange={(e) => setDiscountInputValue(e.target.value)}
                className="inline tw-w-28 tw-h-6 tw-ml-8 tw-border tw-rounded-l-[5px] tw-border-[#0000003b]"
                type="number"
              />
              {discountOptions === "₹" && (
                <button
                  onClick={toggleDropdown}
                  className="tw-bg-violet-700 tw-h-6 tw-relative tw-right-[26px] tw-top-[0px] tw-bottom-[1px] tw-text-white tw-border-r tw-rounded-r-[5px] tw-w-7"
                >
                  ₹
                </button>
              )}
              {discountOptions === "%" && (
                <button
                  onClick={toggleDropdown}
                  className="tw-bg-violet-700 tw-h-6 tw-relative tw-right-[26px] tw-top-[0px] tw-bottom-[1px] tw-text-white tw-border-r tw-rounded-r-[5px] tw-w-7"
                >
                  %
                </button>
              )}

              {isOpen && (
                <div className="tw-absolute tw-ml-44 tw-z-10 tw-w-10 tw-mt-6 tw-py-2 tw-bg-white tw-rounded-md tw-shadow-lg">
                  <div
                    className="tw-cursor-pointer"
                    onClick={() => handleToggleDropdown("₹")}
                  >
                    ₹
                  </div>
                  <div
                    className="tw-cursor-pointer"
                    onClick={() => handleToggleDropdown("%")}
                  >
                    %
                  </div>
                </div>
              )}
            </div>
            <span>{discount ? discount : "0.00"}</span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-sm tw-pb-2">
            <div className="tw-inline">
              <span>TCS</span>
              <Select
                name="tax_inp"
                value={tcsInputValue}
                className="tw-w-28 tw-ml-16 tw-h-6"
              >
                {taxes?.taxes &&
                  taxes?.taxes?.map((tax) => (
                    <MenuItem
                      onClick={(e) => handleChangeTcs(tax)}
                      value={tax.taxName}
                    >
                      {tax.taxName}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <span>
              {formValues?.current?.tcs
                ? (subtotal * formValues?.current?.tcs?.rate) / 100
                : 0}
              .00
            </span>
          </div>
          <div className="tw-flex tw-justify-between tw-text-base tw-font-bold tw-pb-2">
            <span>Total(₹)</span>
            <span>{total}.00</span>
          </div>
        </div>
      </div>
      {/* bottom section */}
    </div>
  );
};

export default AddAndEditBill;
