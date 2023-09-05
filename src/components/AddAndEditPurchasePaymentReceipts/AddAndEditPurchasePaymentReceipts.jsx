import * as Yup from "yup";
import Input from "../Input/Input";
import SubNavBar from "../SubNavbar/SubNavbar";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import { useEffect, useRef, useState } from "react";
import { MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import {
  addNewPaymentReceipt,
  getAddNewPaymentReceipt,
} from "../../services/paymentReceipts";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowDown, IoMdSettings } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { setVendor } from "../../redux/ducks/vendorSlice";
import { setLastPay } from "../../redux/ducks/receiptSlice";
import { setBanks } from "../../redux/ducks/bankingSlice";
import { setBill } from "../../redux/ducks/billSlice";

const schema = Yup.object().shape({
  vendor: Yup.string().required("Please add a vendor"),
  paymentReceiptDate: Yup.string().required("Payment date is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
  referenceNumber: Yup.string().required("Reference number is required"),
  expenseAccount: Yup.string().required("Account is required"),
});

const initialValues = {
  vendor: "",
  paymentReceiptDate: "",
  paymentMethod: "",
  referenceNumber: "",
  expenseCategory: "Purchases",
  expenseAccount: "",
  expenseAccountType: "",
};

const AddAndEditPurchasePaymentReceipt = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentReceiptDate, setPaymentReceiptDate] = useState(null);
  const { billsList } = useSelector((state) => state.bill);
  const [formErrors, setFormErrors] = useState({});
  const formValues = useRef(initialValues);
  const [vendors, setVendors] = useState(null);
  const { banksList } = useSelector((state) => state.banking);
  const [amountToApply, setAmountToApply] = useState(0);
  const [amountAndValue, setAmountAndValue] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [salesInputValue, setSalesInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filteredInvoice, setFilteredInvoice] = useState([]);
  const { vendorsList } = useSelector((state) => state.vendors);
  const [filteredAccount, setFilteredAccount] = useState([]);
  const [accountInputValue, setAccountInputValue] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [show, setShow] = useState(false);
  const { lastPay } = useSelector((state) => state.receipts);
  const [bankId, setBankId] = useState(null);

  const payments = [{ method: "Cash" }, { method: "UPI" }];

  useEffect(() => {
    (async () => {
      const data = await getAddNewPaymentReceipt();
      const { vendors, lastPay, banksList, bills } = data;

      dispatch(setBill(bills));
      dispatch(setVendor(vendors));
      dispatch(setLastPay(lastPay));
      dispatch(setBanks({ banksList }));

      if (id) {
        const bill = bills.filter((x) => x._id === id);

        if (bill?.length) {
          handleAddToItemsList(bill);
        }
      }
    })();
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      await schema.validate(formValues.current, { abortEarly: false });
      const formData = new FormData();
      Object.keys(formValues.current).forEach((key) => {
        formData.append(key, formValues.current[key]);
      });

      formData.append(
        "paymentReceipt",
        lastPay[0]?.paymentReceipt
          ? (parseInt(lastPay[0]?.paymentReceipt, 10) + 1)
              .toString()
              .padStart(lastPay[0]?.paymentReceipt.length, "0")
          : "0001"
      );
      formData.append("itemDetails", JSON.stringify(itemsList));
      formData.append("vendorId", vendors?._id);
      formData.append("email", vendors?.email);
      formData.append("amountToApply", amountToApply);
      if (formValues.current.expenseAccountType !== "pettyCash") {
        formData.append("bankId", bankId);
      }

      const object = Object.fromEntries(formData.entries());

      await addNewPaymentReceipt(object);
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
    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleSaveAndSend = () => {
    formValues.current = { ...formValues.current, actionType: true };
    handleSubmit();
  };

  const handleChangePaymentReceiptDate = (e) => {
    setPaymentReceiptDate(e);
    const event = {
      target: {
        name: "paymentReceiptDate",
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

  const handleSalesFiltering = (event) => {
    const input = event.target.value;
    setSalesInputValue(input);

    // Filter options by input value
    const filtered = billsList?.filter((option) => {
      const name = option.bill;
      return name.toLowerCase().includes(input.toLowerCase());
    });
    setFilteredInvoice(filtered);
  };

  const handleInputClick = (inpId) => {
    const inp_select = document.getElementById(inpId);
    setFilteredOptions(vendorsList);

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleSalesInputClick = () => {
    setFilteredInvoice(billsList);
    setShow(!show);
  };

  const assignSelectValue = async (client) => {
    const items = billsList.filter(
      (x) => x.vendorId === client._id && !x.blackList
    );
    setItemsList(items);

    const event = {
      target: {
        name: "vendor",
        value: client.firstName + " " + client.lastName,
      },
    };

    setInputValue(client.firstName + " " + client.lastName);
    await handleInputChange(event);
    setVendors(client);
    const inp_select = document.getElementById("inp-select-list");
    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
    setSalesInputValue("");
  };

  const handleMath = (event, id) => {
    const require = document.getElementById(id);
    require?.classList?.add("tw-collapse");

    const e = event.target.value;
    if (e === 0) {
      return;
    }

    const data = itemsList.map((x) => {
      if (x._id === id) {
        if (e > x.balanceDue || e < 0) {
          require?.classList?.remove("tw-collapse");
          return null;
        }
        return { ...x, paying: Number(e) };
      }
      return x;
    });

    if (!data.includes(null) && data.length) {
      setItemsList(data);
      handleCalculations(event);
    }
  };

  const handleCalculations = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let sum = 0;
    const obj = {
      ...amountAndValue,
    };

    obj[name] = value;
    // amountAndValue[name] = value;

    setAmountAndValue(obj);

    for (let name in obj) {
      if (obj.hasOwnProperty(name)) {
        sum += Number(obj[name]);
      }
    }

    setAmountToApply(sum);
  };

  const handleAddToItemsList = (items) => {
    const { vendor, vendorId, bill } = items[0];

    setShow(false);
    const client = vendorsList.filter((x) => x._id === vendorId);

    formValues.current.vendor = vendor;
    setVendors(client[0]);
    setInputValue(vendor);
    setSalesInputValue("BIL-" + bill);
    setItemsList(items);
  };

  const handleNextAndPrev = (action) => {
    // if (action === 'next' && client ) {
    //     let items = [];
    //     let limit = currentDisplayingReceipts.length;
    //     for( let i = limit; i < limit + 3; i++ ) {
    //       if(itemsList[i]) {
    //         items.push(itemsList[i]);
    //       }
    //       else {
    //         return
    //       }
    //     }
    //     setCurrentDisplayingReceipts(items)
    // }
    // else if(action === 'prev' && client) {
    //   let items = [];
    //     let limit = currentDisplayingReceipts.length - 1;
    //     for( let i = limit; i > limit - 3; i-- ) {
    //       if( i < 0 ) break
    //       items.push(itemsList[i] ? itemsList[i] : null)
    //     }
    //     setCurrentDisplayingReceipts(items)
    // }
  };

  const handleAccountInputClick = (inpId) => {
    const inp_select = document.getElementById(inpId);
    const pettyOption = [{ bankName: "Petty cash" }];

    setFilteredAccount(pettyOption.concat(banksList));

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleBankFiltering = (event) => {
    const pettyOption = [{ bankName: "Petty cash" }];
    const input = event.target.value;
    setAccountInputValue(input);
    formValues.current = {
      ...formValues.current,
      expenseAccount: "",
      expenseAccountType: "",
    };

    setBankId(null);
    setFormErrors({ ...formErrors, expenseAccount: "Account is required" });

    // Filter options by input value
    const filtered = pettyOption?.concat(banksList)?.filter((option) => {
      const name = option.bankName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredAccount(filtered);
  };

  const assignValueToAccount = async (account, inp) => {
    let newValues;
    if (account.bankName === "Petty cash") {
      newValues = {
        expenseAccountType: "pettyCash",
        expenseAccount: account.bankName,
      };

      setBankId(null);
    } else {
      newValues = {
        expenseAccountType: "bank",
        expenseAccount: account.bankName,
      };

      setBankId(account._id);
    }

    setAccountInputValue(account.bankName);
    formValues.current = { ...formValues.current, ...newValues };
    setFormErrors({ ...formErrors, expenseAccount: null });

    const inp_select = document.getElementById(inp);
    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  // useEffect(() => {
  //   handleNextAndPrev("next");
  // }, [itemsList]);

  return (
    <div className="tw-relative tw-mt-16 tw-min-h-[90vh] tw-bg-white">
      {/* section header starting from here */}
      <SubNavBar
        leftText={"Create new payment receipt"}
        rightText={"Print or Preview"}
        buttons={buttons}
        fullBorder={true}
      />
      {/* section header starting ending */}

      {/* form staring */}
      <form className="tw-px-14 tw-py-8 tw-mt-12 tw-bg-white">
        <div className="tw-grid md:tw-grid-cols-12 md:tw-grid-flow-row tw-gap-10">
          <div className="tw-col-span-4">
            {/* vendor_input  */}
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
                      : "tw-border"
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
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                          onClick={(e) => assignSelectValue(clients)}
                        >
                          {clients.firstName + " " + clients.lastName}
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
            {/* Payment_date_input */}
            <label className="tw-mb-[6px]">Payment date</label>
            <div className="Payment_date_input tw-pb-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(e) => handleChangePaymentReceiptDate(e)}
                  className="tw-w-full"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 27,
                      border: formErrors.paymentReceiptDate
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

            {/* Billing address */}
            <div className="">
              <label>Find by Sales #</label>
              <div className="relative">
                <input
                  autoComplete="off"
                  name={""}
                  placeholder={"Enter Sales Number"}
                  onClick={handleSalesInputClick}
                  className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] `}
                  value={salesInputValue}
                  type="text"
                  onChange={handleSalesFiltering}
                />
                {show && (
                  <div className="tw-relative tw-w-full">
                    <ul className="tw-absolute tw-top-0.5 tw-w-full tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm">
                      {filteredInvoice?.length > 0 ? (
                        filteredInvoice.map(
                          (bills, idx) =>
                            !bills.blackList && (
                              <li
                                key={idx}
                                className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                onClick={(e) => handleAddToItemsList([bills])}
                              >
                                {"BIL-" + bills.bill}
                              </li>
                            )
                        )
                      ) : (
                        <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white">
                          No bills
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tw-col-span-8 tw-max-w-3xl">
            <div className="tw-flex">
              <div className="tw-w-3/6 tw-pb-4">
                {/* Payment_input */}
                <label>Payment Receipt #</label>
                <input
                  name="paymentReceipt"
                  className={`tw-h-[27px] tw-mt-[6px] tw-text-[12px]`}
                  type="text"
                  value={
                    lastPay[0]?.paymentReceipt
                      ? "PAY-" +
                        (parseInt(lastPay[0]?.paymentReceipt, 10) + 1)
                          .toString()
                          .padStart(lastPay[0]?.paymentReceipt.length, "0")
                      : "PAY-0001"
                  }
                  placeholder="PAY-0001"
                />
                <span className="tw-relative tw-z-0">
                  <IoMdSettings className="tw-absolute tw-bottom-[2px] tw-left-[-28px] tw-text-[#8153E2] tw-z-40" />
                </span>
              </div>
            </div>
            <div className="tw-flex tw-pb-4">
              <div className="tw-w-[270px]">
                <SelectDropDown
                  label={"Payment Method"}
                  name={"paymentMethod"}
                  onChange={handleInputChange}
                  errorMessage={formErrors.paymentMethod}
                  style={{
                    border: formErrors.paymentMethod ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                    height: "27px",
                  }}
                >
                  {payments.map((x) => (
                    <MenuItem value={x.method}>{x.method}</MenuItem>
                  ))}
                </SelectDropDown>
              </div>
              <div className="tw-w-[270px] tw-ml-5">
                <Input
                  name={"referenceNumber"}
                  label={"Reference.no."}
                  onChange={handleInputChange}
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
            {/* account_input  */}
            <div className="tw-w-[270px]">
              <label>Account</label>
              <div className="relative">
                <input
                  id="inp--bank--select"
                  autoComplete="off"
                  name={"expenseAccount"}
                  value={accountInputValue}
                  onClick={() => handleAccountInputClick("banks--select--list")}
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
                  {filteredAccount?.length > 0 && (
                    <ul
                      id="banks--select--list"
                      className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                    >
                      {filteredAccount.map((account, idx) => (
                        <li
                          key={idx}
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                          onClick={(e) =>
                            assignValueToAccount(account, "banks--select--list")
                          }
                        >
                          {account.bankName}
                        </li>
                      ))}
                      <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]">
                        <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add
                        new account
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* form ending */}

      {/* { border section} */}
      <div className="tw-w-full tw-px-14 tw-bg-white">
        <div className="tw-border-t tw-w-full">
          {itemsList.length > 0 && (
            <h3 className="tw-pt-8 tw-text-start">
              {itemsList.length > 3
                ? "Outstanding Transactions"
                : "Transaction List"}
            </h3>
          )}
        </div>
      </div>
      {/* { border section} */}

      {/* table starting */}
      {itemsList.length > 0 && (
        <div className="tw-relative tw-overflow-x-auto tw-p-8 tw-bg-white">
          <table className="tw-w-full tw-text-sm tw-text-left">
            <thead className="tw-border-b">
              <tr>
                <th
                  scope="col"
                  className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                ></th>
                <th
                  scope="col"
                  className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                >
                  SALES NUMBER
                </th>
                <th
                  scope="col"
                  className="tw-px-4 tw-w-28 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                >
                  DUE DATE
                </th>
                <th
                  scope="col"
                  className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                >
                  ORIGINAL AMOUNT
                </th>
                <th
                  scope="col"
                  className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                >
                  BALANCE DUE
                </th>
                <th
                  scope="col"
                  className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                >
                  PAYMENT
                </th>
                <th scope="col" className="tw-px-4 tw-pt-2"></th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map(
                (x) =>
                  !x?.blackList && (
                    <tr className="tw-bg-white tw-border-b">
                      <td className="tw-border-r">
                        <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                          <input
                            className="tw-w-4 tw-h-4 tw-text-violet-700"
                            type="checkbox"
                          />
                        </div>
                      </td>
                      <td className="tw-border-r">
                        <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                          {"BIL-" + x?.bill}
                        </div>
                      </td>
                      <td className=" tw-border-r">
                        <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                          {`${new Date(x?.expiryDate)
                            .getDate()
                            .toString()
                            .padStart(2, "0")}-${(
                            new Date(x?.expiryDate).getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${new Date(
                            x?.expiryDate
                          ).getFullYear()}`}
                        </div>
                      </td>
                      <td className=" tw-border-r">
                        <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                          {x?.total}
                        </div>
                      </td>
                      <td className="tw-border-r">
                        <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                          {/* { x.payed ? x.total -  x.payed : x.total -  0 } */}
                          {x?.total - x?.payed - (x?.paying ? x?.paying : 0)}
                        </div>
                      </td>
                      <td className=" tw-border-r">
                        <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                          <input
                            name={x?.receipt}
                            onChange={(e) => handleMath(e, x?._id)}
                            className="tw-w-24
                    tw-border-none
                    focus:tw-outline-none"
                            type="number"
                            placeholder="0.00"
                          />
                        </div>
                        <div id={x?._id} className="tw-relative tw-collapse">
                          <h3 className="tw-absolute tw-bottom-9 tw-left-3 tw-text-red-500 tw-w-44 tw-text-xs">
                            please enter a valid amount
                          </h3>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          <div className="tw-flex tw-items-center tw-justify-end tw-px-11 tw-py-3">
            <button
              onClick={() => handleNextAndPrev("prev")}
              className="tw-mr-9 tw-text-[12px]"
            >
              <MdArrowBackIos className="tw-inline tw-text-[8px] tw-mb-0.5" />
              Previous
            </button>
            <button
              onClick={() => handleNextAndPrev("next")}
              className="tw-text-[12px]"
            >
              Next
              <MdArrowForwardIos className="tw-inline tw-text-[8px] tw-mb-0.5" />
            </button>
          </div>
        </div>
      )}
      {/* table ending */}

      {/* bottom section */}

      {itemsList.length > 0 && (
        <div className="tw-flex tw-items-end tw-flex-col tw-bg-white tw-text-xs tw-font-bold tw-px-28 tw-pb-9">
          <div>
            <span className="tw-mr-24">Amount to Apply (₹)</span>
            <span>{amountToApply}.00</span>
          </div>
          <div className="tw-pt-2">
            <span className="tw-mr-[93px]">Amount to Credit (₹)</span>
            <span>0.00</span>
          </div>
        </div>
      )}

      {/* bottom section */}
    </div>
  );
};

export default AddAndEditPurchasePaymentReceipt;
