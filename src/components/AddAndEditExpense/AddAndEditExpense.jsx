import * as Yup from "yup";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import SubNavBar from "../SubNavbar/SubNavbar";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import { useEffect, useRef, useState } from "react";
import { MenuItem } from "@mui/material";
import { BiRupee } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  getAddNewExpense,
  addNewExpense,
  editExpense,
  getAllExpenses,
  getAllBanks,
} from "../../services/bankingServices";
import { useDispatch, useSelector } from "react-redux";
import { setVendor } from "../../redux/ducks/vendorSlice";
import { setCustomer } from "../../redux/ducks/customerSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setBanking, setBanks } from "../../redux/ducks/bankingSlice";
import { setTax } from "../../redux/ducks/taxSlice";
import dayjs from "dayjs";
import { getAllTax } from "../../services/taxService";

const AddAndEditExpense = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formValues = useRef();
  const loading = useRef();
  const { vendorsList } = useSelector((state) => state.vendors);
  const { customersList } = useSelector((state) => state.customers);
  const { taxes } = useSelector((state) => state);
  const { banksList, bankExpenseList, pettyCashExpenseList } = useSelector(
    (state) => state.banking
  );

  const [formErrors, setFormErrors] = useState({});
  const [vendorInputValue, setVendorInputValue] = useState("");
  const [customerInputValue, setCustomerInputValue] = useState("");
  const [expenseType, setExpenseType] = useState("goods");
  const [date, setDate] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [expenseAccountType, setExpenseAccountType] = useState(null);
  const [bankId, setBankId] = useState(null);
  const [prevBankId, setPrevBankId] = useState(null);
  const [prevAmount, setPrevAmount] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [codeInputValue, setCodeInputValue] = useState(null);
  const [expenseAccountInputValue, setExpenseAccountInputValue] = useState("");
  const [filteredExpenseAccount, setFilteredExpenseAccount] = useState([]);
  const trimmedPath = location.pathname.split("/").slice(2).join("/");

  const pageValue = trimmedPath.includes("add-new-petty-cash-expense")
    ? "pettyCash"
    : trimmedPath.includes("add-new-bank-expense")
    ? "bankCash"
    : trimmedPath.includes("edit-expense")
    ? "editExpense"
    : "";

  const expenseCategories = [{ name: "Sales" }, { name: "Purchases" }];

  const indiaStates = [
    { state: "Andhra Pradesh" },
    { state: "Arunachal Pradesh" },
    { state: "Assam" },
    { state: "Bihar" },
    { state: "Chhattisgarh" },
    { state: "Goa" },
    { state: "Gujarat" },
    { state: "Haryana" },
    { state: "Himachal Pradesh" },
    { state: "Jharkhand" },
    { state: "Karnataka" },
    { state: "Kerala" },
    { state: "Madhya Pradesh" },
    { state: "Maharashtra" },
    { state: "Manipur" },
    { state: "Meghalaya" },
    { state: "Mizoram" },
    { state: "Nagaland" },
    { state: "Odisha" },
    { state: "Punjab" },
    { state: "Rajasthan" },
    { state: "Sikkim" },
    { state: "Tamil Nadu" },
    { state: "Telangana" },
    { state: "Tripura" },
    { state: "Uttar Pradesh" },
    { state: "Uttarakhand" },
    { state: "West Bengal" },
    { state: "Andaman and Nicobar Islands" },
    { state: "Chandigarh" },
    { state: "Dadra and Nagar Haveli and Daman and Diu" },
    { state: "Lakshadweep" },
    { state: "Delhi" },
    { state: "Puducherry" },
    { state: "Jammu and Kashmir" },
    { state: "Ladakh" },
  ];

  const handleSubmit = async () => {
    try {
      await schema.validate(formValues.current, { abortEarly: false });
      const formData = new FormData();
      Object.keys(formValues.current).forEach((key) => {
        formData.append(key, formValues.current[key]);
      });

      formData.append("expenseType", expenseType);
      formData.append("expenseAccountType", expenseAccountType);

      if (pageValue === "bankCash" || pageValue === "pettyCash") {
        expenseAccountType === "bank" && formData.append("bankId", bankId);
        const object = Object.fromEntries(formData.entries());
        await addNewExpense(object);
      } else {
        expenseAccountType === "bank" && formData.append("bankId", bankId);
        formData.append("prevBankId", prevBankId);
        formData.append("prevAmount", prevAmount);
        formData.append("_id", selectedExpense[0]?._id);

        const object = Object.fromEntries(formData.entries());
        await editExpense(object);
      }
      goBack();
    } catch (error) {
      console.log(error);
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

    if (selectedExpense?.length) {
      const items = { ...selectedExpense[0], [name]: value };
      setSelectedExpense([items]);
    }

    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      console.log(error);
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleChangeDate = (e) => {
    setDate(e);
    const event = {
      target: {
        name: "date",
        value: e,
      },
    };
    handleInputChange(event);
  };

  const goBack = () => {
    navigate(-1);
  };

  const buttons = [
    {
      buttonName: "Cancel",
      buttonStyles:
        "tw-px-3 tw-h-8 tw-w-16 tw-mr-5 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]",
      buttonFunction: goBack,
    },
    {
      buttonName: "Save",
      buttonStyles:
        "tw-px-3 tw-h-8 tw-w-16 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-rounded-md tw-border tw-border-[#8153E2] tw-bg-[#8153E2]",
      buttonFunction: handleSubmit,
    },
  ];

  const handleVendorFiltering = (event) => {
    const input = event.target.value;
    setVendorInputValue(input);

    // Filter options by input value
    const filtered = vendorsList?.filter((option) => {
      const name = option.firstName + " " + option.lastName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredVendors(filtered);
  };

  const handleVendorInputClick = (inpId) => {
    const inp_select = document.getElementById(inpId);
    setFilteredVendors(vendorsList);

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleCustomerFiltering = (event) => {
    const input = event.target.value;
    setCustomerInputValue(input);

    // Filter options by input value
    const filtered = customersList?.filter((option) => {
      const name = option.firstName + " " + option.lastName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredCustomers(filtered);
  };

  const handleCustomerInputClick = (inpId) => {
    const inp_select = document.getElementById(inpId);

    setFilteredCustomers(customersList);

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleBankFiltering = (event) => {
    const input = event.target.value;
    setExpenseAccountInputValue(input);
    const pettyOption = [{ bankName: "Petty cash" }];

    // Filter options by input value
    const filtered = pettyOption?.concat(banksList)?.filter((option) => {
      const name = option.bankName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    console.log(filtered);
    setFilteredExpenseAccount(filtered);
  };

  const handleExpenseAccountInputClick = (inpId) => {
    const inp_select = document.getElementById(inpId);
    const pettyOption = [{ bankName: "Petty cash" }];

    setFilteredExpenseAccount(pettyOption.concat(banksList));

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const assignSelectValue = async (value, valueHolder, inp) => {
    let event;
    if (valueHolder === "vendor") {
      event = {
        target: {
          name: "vendor",
          value: value.firstName + " " + value.lastName,
        },
      };

      setSelectedVendor(value);
      setVendorInputValue(value.firstName + " " + value.lastName);
    }

    if (valueHolder === "customer") {
      event = {
        target: {
          name: "customer",
          value: value.firstName + " " + value.lastName,
        },
      };

      setSelectedCustomer(value);
      setCustomerInputValue(value.firstName + " " + value.lastName);
    }

    if (valueHolder === "expenseAccount") {
      event = handleExpenseAccountValueAssign(value);
    }

    if (valueHolder === "pettyCash") {
      event = handleClickPettyCash();
    }

    await handleInputChange(event);

    const inp_select = document.getElementById(inp);
    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleExpenseAccountValueAssign = (value) => {
    const event = {
      target: {
        name: "expenseAccount",
        value: value?.bankName,
      },
    };

    setExpenseAccountType("bank");
    setBankId(value?._id);
    setExpenseAccountInputValue(value?.bankName);

    return event;
  };

  const handleClickPettyCash = () => {
    const event = {
      target: {
        name: "expenseAccount",
        value: "pettyCash",
      },
    };
    setExpenseAccountType("pettyCash");
    setExpenseAccountInputValue("Petty cash");

    return event;
  };

  useEffect(() => {
    // dispatch(getAddNewEstimate());
    (async () => {
      const { vendors, customers, taxes, banksList } = await getAddNewExpense();

      dispatch(setTax(taxes));
      dispatch(setVendor(vendors));
      dispatch(setCustomer(customers));

      if (pageValue === "pettyCash" || pageValue === "bankCash") {
        dispatch(setBanks({ banksList }));
      }

      if (pageValue === "editExpense") {
        const banksList = await getAllBanks();
        const { bankExpenseList, pettyCashExpenseList } =
          await getAllExpenses();

        dispatch(
          setBanking({ banksList, bankExpenseList, pettyCashExpenseList })
        );
      }
    })();

    loading.current = false;
  }, [dispatch]);

  useEffect(() => {
    if (pageValue === "pettyCash") {
      assignSelectValue(null, "pettyCash");
    } else if (pageValue === "bankCash") {
      /* if not have an id then redirect no 404 */
      const bank = banksList?.filter((x) => x._id === id);

      // if (id && banksList) {
      //   if (!bank.length) {
      //     navigate("/not-found");
      //   }
      // }

      assignSelectValue(bank[0], "expenseAccount");
    }
    if (pageValue === "editExpense") {
      const expense = bankExpenseList
        ?.concat(pettyCashExpenseList)
        .filter((x) => x._id === id);

      if (id && pettyCashExpenseList && bankExpenseList) {
        if (!expense.length) {
          navigate("/not-found");
        }
      }
      formValues.current = expense[0];
      setSelectedExpense(expense);
      setExpenseType(expense[0]?.expenseType);
      setDate(dayjs(new Date(expense[0]?.date)));
      setCustomerInputValue(expense[0]?.customer);
      setVendorInputValue(expense[0]?.vendor);
      setPrevAmount(expense[0]?.amount);

      if (expense[0]?.expenseAccountType !== "pettyCash") {
        setPrevBankId(expense[0]?.bankId);
        const bank = banksList?.filter((x) => x._id === expense[0]?.bankId);
        assignSelectValue(bank[0], "expenseAccount");
      }

      if (expense[0]?.expenseAccountType === "pettyCash") {
        assignSelectValue(null, "pettyCash");
      }
    }
  }, [banksList]);

  const schema = Yup.object().shape({
    expenseAccount: Yup.string().required("Expense account is required"),
    date: Yup.string().required("Date is required"),
    expenseCategory: Yup.string().required("Expense category is required"),
    amount: Yup.string().required("Amount is required"),
    gstTreatment: Yup.string().required("GST treatment is required"),
    sourceOfSupply: Yup.string().required("Source of supply is required"),
    destinationOfSupply: Yup.string().required(
      "Destination of supply is required"
    ),
    hsnCode:
      expenseType === "goods"
        ? Yup.string().required("HSN code is required")
        : Yup.string().nullable(),
    sac:
      expenseType === "services"
        ? Yup.string().required("SAC is required")
        : Yup.string().nullable(),
    invoiceNumber: Yup.string().required("Invoice number is required"),
    referenceNumber: Yup.string().required("Reference number is required"),
    description: Yup.string().required("Description is required"),
    vendor: Yup.string(),
    customer: Yup.string(),
  });

  return (
    <div className="tw-relative tw-mt-16 tw-bg-white">
      {/* section header starting from here */}
      <SubNavBar
        leftText={`${
          pageValue === "editExpense" ? "Edit expense" : "Create new expense"
        }`}
        buttons={buttons}
        fullBorder={true}
      />
      {/* section header starting ending */}
      {console.log(loading.current)}
      {/* form staring */}
      <form
        className={`${
          loading.current !== false ? "tw-animate-pulse" : ""
        } tw-px-14 tw-py-8 tw-mt-12 tw-bg-white`}
      >
        <div className="tw-grid md:tw-grid-cols-12 md:tw-grid-flow-row tw-gap-10">
          <div className="tw-col-span-4">
            {/* Expense type input */}
            <div>
              <label>Expense Type</label>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <input
                  className="tw-w-4 tw-cursor-pointer"
                  type="radio"
                  name="option"
                  value="goods"
                  checked={expenseType === "goods"}
                  onChange={(e) => setExpenseType(e?.target?.value)}
                />
                <span className="tw-text-[12px]">Goods</span>
                <input
                  className="tw-w-4 tw-ml-9 tw-cursor-pointer"
                  type="radio"
                  name="option"
                  value="services"
                  checked={expenseType === "services"}
                  onChange={(e) => setExpenseType(e?.target?.value)}
                />
                <span className="tw-text-[12px]">Services</span>
              </div>
            </div>
            {/* date_input */}
            <label className="tw-mb-[6px]">Date</label>
            <div className="date_input tw-pb-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(e) => handleChangeDate(e)}
                  value={date}
                  className="tw-w-full"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 27,
                      border: formErrors.date ? "1px solid #FF0000" : "",
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

            {/* Amount_input  */}
            <div className="tw-pb-4">
              <label>Amount</label>
              <div className="relative">
                <input
                  id="inp-select"
                  autoComplete="off"
                  name={"amount"}
                  value={selectedExpense && selectedExpense[0]?.amount}
                  onChange={handleInputChange}
                  className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                    formErrors.amount
                      ? "tw-border tw-border-[#FF0000]"
                      : "tw-border"
                  }`}
                  type="number"
                  placeholder="Enter amount"
                />
                <span className="tw-relative tw-z-0">
                  <span className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-font-thin tw-rounded-r tw-p-1.5 tw-px-3 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40">
                    <BiRupee className="" />
                  </span>
                </span>
                <span className="tw-relative tw-z-0">
                  <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                </span>
              </div>
            </div>

            {/* GST treatment */}
            <div className="tw-pb-4">
              {pageValue === "editExpense" ? (
                <SelectDropDown
                  label={"GST treatment"}
                  name={"gstTreatment"}
                  value={selectedExpense && selectedExpense[0]?.gstTreatment}
                  onChange={handleInputChange}
                  errorMessage={formErrors.gstTreatment}
                  style={{
                    border: formErrors.gstTreatment ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                    height: "27px",
                    "margin-top": 0,
                  }}
                >
                  {taxes?.taxes?.map((x) => (
                    <MenuItem value={x.taxName}>{x.taxName}</MenuItem>
                  ))}
                </SelectDropDown>
              ) : (
                <SelectDropDown
                  label={"GST treatment"}
                  name={"gstTreatment"}
                  onChange={handleInputChange}
                  errorMessage={formErrors.gstTreatment}
                  style={{
                    border: formErrors.gstTreatment ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                    height: "27px",
                    "margin-top": 0,
                  }}
                >
                  {taxes?.taxes?.map((x) => (
                    <MenuItem value={x.taxName}>{x.taxName}</MenuItem>
                  ))}
                </SelectDropDown>
              )}
            </div>

            {/* {HSN Code Input // Service accounting code} */}
            <div className="tw-pb-4">
              <Input
                name={
                  expenseType === "goods"
                    ? "hsnCode"
                    : expenseType === "services"
                    ? "sac"
                    : ""
                }
                type={"number"}
                label={
                  expenseType === "goods"
                    ? "HSN code"
                    : expenseType === "services"
                    ? "SAC"
                    : ""
                }
                value={
                  selectedExpense?.length > 0
                    ? expenseType === "goods"
                      ? selectedExpense[0]?.hsnCode
                        ? selectedExpense[0]?.hsnCode
                        : ""
                      : expenseType === "services"
                      ? selectedExpense[0]?.sac
                        ? selectedExpense[0]?.sac
                        : ""
                      : ""
                    : codeInputValue
                }
                onChange={
                  ((e) => setCodeInputValue(e?.target?.value),
                  handleInputChange)
                }
                errorMessage={
                  expenseType === "goods" ? formErrors.hsnCode : formErrors.sac
                }
                style={{
                  border:
                    expenseType === "goods"
                      ? formErrors.hsnCode
                        ? "1px solid #FF0000"
                        : ""
                      : formErrors.sac
                      ? "1px solid #FF0000"
                      : "",
                  height: "27px",
                  fontSize: "12px",
                }}
              />
            </div>

            {/* Description*/}
            <TextArea
              onChange={handleInputChange}
              name="description"
              value={selectedExpense && selectedExpense[0]?.description}
              label={"Description"}
              placeholder={"Description"}
              style={{
                border: formErrors.description
                  ? "1px solid #FF0000"
                  : "2px solid #d6e2d79c;",
                fontSize: "12px",
              }}
            />
          </div>

          <div className="tw-col-span-8 tw-max-w-3xl">
            <div className="tw-flex">
              <div className="tw-w-3/6">
                {/* Expense account_input  */}
                <div className="expenseAccount_input tw-pb-4">
                  <label>Expense account</label>
                  <div className="relative">
                    <input
                      id="inp--bank--select"
                      autoComplete="off"
                      name={"expenseAccount"}
                      value={expenseAccountInputValue}
                      onClick={() =>
                        handleExpenseAccountInputClick("banks--select--list")
                      }
                      onChange={handleBankFiltering}
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                        formErrors.expenseAccount
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
                      placeholder="Select account"
                    />
                    <span className="tw-relative tw-z-0">
                      <BiSearch className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                    </span>
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {filteredExpenseAccount?.length > 0 && (
                        <ul
                          id="banks--select--list"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {filteredExpenseAccount.map((account, idx) => (
                            <li
                              key={idx}
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={(e) =>
                                assignSelectValue(
                                  account,
                                  account.bankName !== "Petty cash"
                                    ? "expenseAccount"
                                    : "pettyCash",
                                  "banks--select--list"
                                )
                              }
                            >
                              {account.bankName}
                            </li>
                          ))}
                          <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]">
                            <AiOutlinePlus className="tw-inline tw-mb-0.5" />{" "}
                            Add new account
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-flex">
              <div className="tw-w-3/6 tw-pb-4">
                {/* Expense category */}
                {pageValue === "editExpense" ? (
                  <SelectDropDown
                    label={"Expense category"}
                    name={"expenseCategory"}
                    value={
                      selectedExpense && selectedExpense[0]?.expenseCategory
                    }
                    onChange={handleInputChange}
                    errorMessage={formErrors.expenseCategory}
                    style={{
                      border: formErrors.expenseCategory
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                      "margin-top": 0,
                    }}
                  >
                    {expenseCategories.map((x) => (
                      <MenuItem value={x.name}>{x.name}</MenuItem>
                    ))}
                  </SelectDropDown>
                ) : (
                  <SelectDropDown
                    label={"Expense category"}
                    name={"expenseCategory"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.expenseCategory}
                    style={{
                      border: formErrors.expenseCategory
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                      "margin-top": 0,
                    }}
                  >
                    {expenseCategories.map((x) => (
                      <MenuItem value={x.name}>{x.name}</MenuItem>
                    ))}
                  </SelectDropDown>
                )}
              </div>
            </div>

            <div className="tw-flex">
              <div className="tw-w-3/6">
                {/* Vendor_input  */}
                <div className="tw-pb-4">
                  <label>Vendor</label>
                  <div className="relative">
                    <input
                      id="vendor--inp--select"
                      autoComplete="off"
                      name={"vendor"}
                      onClick={() => handleVendorInputClick("inp-select-list")}
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                        formErrors.vendor
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
                      placeholder="Select vendor"
                      value={vendorInputValue}
                      onChange={(e) => handleVendorFiltering(e)}
                    />
                    <span className="tw-relative tw-z-0">
                      <BiSearch className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                    </span>
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {filteredVendors?.length > 0 && (
                        <ul
                          id="inp-select-list"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {filteredVendors.map((vendor, idx) => (
                            <li
                              key={idx}
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={(e) =>
                                assignSelectValue(
                                  vendor,
                                  "vendor",
                                  "inp-select-list"
                                )
                              }
                            >
                              {vendor.firstName + " " + vendor.lastName}
                            </li>
                          ))}
                          <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]">
                            <AiOutlinePlus className="tw-inline tw-mb-0.5" />{" "}
                            Add new vendor
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* sourceOFsupply_input */}
            <div className="tw-flex">
              <div className="tw-w-[270px]">
                {pageValue === "editExpense" ? (
                  <SelectDropDown
                    label={"Source of supply"}
                    name={"sourceOfSupply"}
                    value={
                      selectedExpense && selectedExpense[0]?.sourceOfSupply
                    }
                    onChange={handleInputChange}
                    errorMessage={formErrors.sourceOfSupply}
                    style={{
                      border: formErrors.sourceOfSupply
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                      "margin-top": 0,
                    }}
                  >
                    {indiaStates.map((x) => (
                      <MenuItem value={x.state}>{x.state}</MenuItem>
                    ))}
                  </SelectDropDown>
                ) : (
                  <SelectDropDown
                    label={"Source of supply"}
                    name={"sourceOfSupply"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.sourceOfSupply}
                    style={{
                      border: formErrors.sourceOfSupply
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                      "margin-top": 0,
                    }}
                  >
                    {indiaStates.map((x) => (
                      <MenuItem value={x.state}>{x.state}</MenuItem>
                    ))}
                  </SelectDropDown>
                )}
              </div>
              <div className="tw-w-[270px] tw-ml-5">
                {pageValue === "editExpense" ? (
                  <SelectDropDown
                    label={"Destination of supply"}
                    name={"destinationOfSupply"}
                    value={
                      selectedExpense && selectedExpense[0]?.destinationOfSupply
                    }
                    onChange={handleInputChange}
                    errorMessage={formErrors.destinationOfSupply}
                    style={{
                      border: formErrors.destinationOfSupply
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                      "margin-top": 0,
                    }}
                  >
                    {indiaStates.map((x) => (
                      <MenuItem value={x.state}>{x.state}</MenuItem>
                    ))}
                  </SelectDropDown>
                ) : (
                  <SelectDropDown
                    label={"Destination of supply"}
                    name={"destinationOfSupply"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.destinationOfSupply}
                    style={{
                      border: formErrors.destinationOfSupply
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                      "margin-top": 0,
                    }}
                  >
                    {indiaStates.map((x) => (
                      <MenuItem value={x.state}>{x.state}</MenuItem>
                    ))}
                  </SelectDropDown>
                )}
              </div>
            </div>

            {/* invoice number*/}
            <div className="tw-flex tw-py-4">
              <div className="tw-w-[270px]">
                <Input
                  label={"Invoice number"}
                  name={"invoiceNumber"}
                  value={selectedExpense && selectedExpense[0]?.invoiceNumber}
                  onChange={handleInputChange}
                  type={"number"}
                  errorMessage={formErrors.invoiceNumber}
                  style={{
                    border: formErrors.invoiceNumber ? "1px solid #FF0000" : "",
                    height: "27px",
                    fontSize: "12px",
                  }}
                />
              </div>

              {/* Reference number */}
              <div className="tw-w-[270px] tw-ml-5">
                <Input
                  name={"referenceNumber"}
                  label={"Reference number"}
                  value={selectedExpense && selectedExpense[0]?.referenceNumber}
                  onChange={handleInputChange}
                  type={"number"}
                  errorMessage={formErrors.referenceNumber}
                  style={{
                    border: formErrors.referenceNumber
                      ? "1px solid #FF0000"
                      : "",
                    height: "27px",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            <div className="tw-w-3/6">
              {/* Customer_input  */}
              <div className="customer_input tw-pb-4">
                <label>Customer</label>
                <div className="relative">
                  <input
                    id="customer--inp--select"
                    autoComplete="off"
                    name={"customer"}
                    onClick={() =>
                      handleCustomerInputClick("customer-select--list")
                    }
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                      formErrors.customer
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                    placeholder="Select customer"
                    value={customerInputValue}
                    onChange={(e) => handleCustomerFiltering(e)}
                  />
                  <span className="tw-relative tw-z-0">
                    <BiSearch className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                  </span>
                  <span className="tw-relative tw-z-0">
                    <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                  </span>
                  <div className="tw-relative">
                    {filteredCustomers?.length > 0 && (
                      <ul
                        id="customer-select--list"
                        className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                      >
                        {filteredCustomers.map((customer, idx) => (
                          <li
                            key={idx}
                            className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                            onClick={(e) =>
                              assignSelectValue(
                                customer,
                                "customer",
                                "customer-select--list"
                              )
                            }
                          >
                            {customer.firstName + " " + customer.lastName}
                          </li>
                        ))}
                        <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]">
                          <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add
                          new vendor
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAndEditExpense;
