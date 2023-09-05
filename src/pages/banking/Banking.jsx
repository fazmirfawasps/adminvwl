import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TabPanel from "@mui/lab/TabPanel";
import "../estimates/estimates.css";
import currencyCodes from "currency-codes";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import CommonTab from "../../components/CommonTab/CommonTab";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/Modal/ModalComponent";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import TextArea from "../../components/TextArea/TextArea";
import SelectDropDown from "../../components/SelectDropDown/SelectDropDown";
import { MenuItem } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import {
  getAllExpenses,
  getAllBanks,
  addNewBank,
  deleteExpense,
} from "../../services/bankingServices";
import {
  setBanking,
  setBanks,
  setExpense,
} from "../../redux/ducks/bankingSlice";

const tabHeadContent = [
  { value: "1", label: "Petty Cash" },
  { value: "2", label: "Bank or Credit Card" },
];

const baseStyle = {
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

const status = [
  {
    value: "INR",
  },
  {
    value: "INR2",
  },
  {
    value: "INR3",
  },
];

function Banking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formValues = useRef();
  const allCurrencies = currencyCodes.data;
  const { banksList, bankExpenseList, pettyCashExpenseList } = useSelector(
    (state) => state.banking
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedRow, setSelectedRow] = useState([]);
  const [bankingList, setBankingList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [type, setType] = useState("bank");
  const [addNewBankModalOpen, setAddNewBankModalOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [show, setShow] = useState(false);

  const schema = Yup.object().shape({
    accountName: Yup.string().required("Please add a account name"),
    accountCode: Yup.string().required("Account code is required"),
    accountNumber:
      type === "bank"
        ? Yup.string().required("Account number is required")
        : Yup.string(),
    cardNumber:
      type === "creditCard"
        ? Yup.string().required("Card number is required")
        : Yup.string(),
    bankName: Yup.string().required("Bank name is required"),
    ifsc:
      type === "bank"
        ? Yup.string().required("IFSC is required")
        : Yup.string(),
    currency: Yup.string().required("Currency is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    (async () => {
      const banksList = await getAllBanks();
      const { bankExpenseList, pettyCashExpenseList } = await getAllExpenses();

      dispatch(
        setBanking({ banksList, bankExpenseList, pettyCashExpenseList })
      );
    })();
  }, [dispatch]);

  useEffect(() => {
    if (banksList) {
      assignSelectValue(banksList[0]);
    }
  }, [banksList]);

  useEffect(() => {
    if (selectedBank) {
      assignSelectValue(selectedBank);
    }
  }, [bankExpenseList]);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: (params) => {
        const formattedDate = new Date(params?.row?.date).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "2-digit", day: "2-digit" }
        );
        return <div>{formattedDate}</div>;
      },
    },
    { field: "reference", headerName: "Reference #", width: 130 },
    {
      field: "type",
      headerName: "Type",
      width: 120,
    },
    {
      field: "deposit",
      headerName: "Deposit",
      width: 120,
    },
    {
      field: "withdrawals",
      headerName: "Withdrawals",
      width: 120,
    },
    {
      field: "runningBalance",
      headerName: "Running Balance",
      width: 130,
    },
  ];

  const handleRowClick = (e, listOfItems) => {
    const id = e?.row?.id;
    if (!id) {
      if (e?.length) {
        const items = e.map((item1) => {
          const matchedItem = listOfItems.find((item2) => item2._id === item1);
          return { ...matchedItem };
        });

        return setSelectedRow(items);
      }

      setSelectedRow([]);
      return;
    }

    if (selectedRow?.length) {
      const exist = selectedRow?.filter((x) => x._id === id);

      if (exist?.length) {
        const filteredItems = selectedRow?.filter((x) => x._id !== id);
        setSelectedRow(filteredItems);
      }
    }
  };

  const handleNavigation = (url) => {
    navigate(url);
  };

  const handleDelete = async () => {
    setLoading(true);
    const { bankExpenseList, pettyCashExpenseList } = await deleteExpense(
      selectedRow
    );

    dispatch(setExpense({ bankExpenseList, pettyCashExpenseList }));

    setLoading(false);
    setOpen(false);
  };

  const buttons = [
    {
      buttonName: "+New Bank or Card",
      buttonStyles:
        "tw-px-3 tw-py-1 tw-h-8 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-[5px] tw-border tw-border-[#8153E2]",
      buttonFunction: () => setAddNewBankModalOpen(true),
    },
  ];

  const handleSubmit = async () => {
    try {
      await schema.validate(formValues.current, { abortEarly: false });
      const formData = new FormData();
      Object.keys(formValues.current).forEach((key) => {
        formData.append(key, formValues.current[key]);
      });
      formData.append("type", type);

      const object = Object.fromEntries(formData.entries());
      const banksList = await addNewBank(object);
      dispatch(setBanks({ banksList }));
      setAddNewBankModalOpen(false);
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
    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleInputClick = () => {
    setFilteredOptions(banksList);

    setShow(!show);
  };

  const handleFiltering = (event) => {
    const input = event.target.value;
    setInputValue(input);

    // Filter options by input value
    const filtered = banksList?.filter((option) => {
      const name = option.bankName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredOptions(filtered);
  };

  const assignSelectValue = async (value) => {
    setInputValue(
      value?.bankName +
        ` ( xxxx${
          value?.accountNumber
            ? value?.accountNumber?.toString().substr(-4)
            : value?.cardNumber?.toString().substr(-4)
        } )`
    );

    const filteredExpenses = bankExpenseList?.filter(
      (x) => value?._id === x?.bankId
    );

    setSelectedBank(value);
    setBankingList(filteredExpenses);

    setShow(false);
  };

  const input = {
    input: (
      <>
        <input
          id="inp-select"
          autoComplete="off"
          name={"customer"}
          onClick={handleInputClick}
          className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] tw-border tw-cursor-pointer`}
          type="text"
          placeholder="Select bank"
          value={inputValue}
          onChange={handleFiltering}
        />
        <span
          onClick={handleInputClick}
          className="tw-relative tw-z-0 tw-cursor-pointer"
        >
          <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-22px] tw-text-[#8153E2] tw-z-40" />
        </span>
        <div className="tw-relative">
          {filteredOptions?.length > 0 && show && (
            <ul
              id="inp-select-list"
              className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
            >
              {filteredOptions.map((bank, idx) => (
                <li
                  key={idx}
                  className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                  onClick={(e) => assignSelectValue(bank, "inp-select-list")}
                >
                  {bank.bankName} ( xxxx
                  {bank?.accountNumber
                    ? bank?.accountNumber?.toString().substr(-4)
                    : bank?.cardNumber?.toString().substr(-4)}{" "}
                  )
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    ),
  };

  return (
    <>
      <div className="estimate-wrapper tw-mt-16">
        <Box sx={{ width: "100%" }}>
          {/* modal starting for confirmation */}
          <ModalComponent
            title={`${
              value === "1"
                ? "Delete receipt"
                : value === "2"
                ? "Delete payment receipt"
                : "Delete refund receipt"
            }`}
            onClose={(e) => setOpen(false)}
            open={open}
            fade={open}
            style={{ ...baseStyle, ...modal2Style }}
          >
            <div className="tw-text-[12px] tw-p-3">
              Are you sure you want to delete the selected {selectedRow?.length}{" "}
              {selectedRow?.length === 1 ? "item" : "items"} ?
            </div>
            <div className="tw-h-20 tw-flex tw-items-center tw-justify-center tw-gap-5">
              <button
                onClick={() => setOpen(!open)}
                className="tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-green-500 tw-rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-red-500 tw-rounded-md`}
              >
                {loading ? "Please wait" : "Delete"}
              </button>
            </div>
          </ModalComponent>

          {/* modal ending for confirmation */}

          {/* { modal starting for add new bank } */}
          <ModalComponent
            title={"New Bank or Credit Card"}
            onClose={(e) => setAddNewBankModalOpen(false)}
            open={addNewBankModalOpen}
            fade={addNewBankModalOpen}
            style={{ ...baseStyle, ...modal2Style2 }}
          >
            <div className="tw-px-6 tw-py-3">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <input
                  className="tw-w-4 tw-cursor-pointer"
                  type="radio"
                  name="option"
                  value="bank"
                  checked={type === "bank"}
                  onClick={(e) => setType(e?.target?.value)}
                />
                <span className="tw-text-[12px]">Bank</span>
                <input
                  className="tw-w-4 tw-ml-9 tw-cursor-pointer"
                  type="radio"
                  name="option"
                  value="creditCard"
                  checked={type === "creditCard"}
                  onClick={(e) => setType(e?.target?.value)}
                />
                <span className="tw-text-[12px]">Credit Card</span>
              </div>
              <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-5 tw-mb-2">
                <div className="tw-w-full">
                  <Input
                    type={"text"}
                    name={"accountName"}
                    label={"Account Name"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.accountName}
                    style={{
                      border: formErrors.accountName ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
                <div className="tw-w-full">
                  <Input
                    type={"number"}
                    name={"accountCode"}
                    label={"Account Code"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.accountCode}
                    style={{
                      border: formErrors.accountCode ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
                <div className="tw-w-full">
                  <Input
                    type={"number"}
                    name={type === "bank" ? "accountNumber" : "cardNumber"}
                    label={type === "bank" ? "Account Number" : "Card Number"}
                    onChange={handleInputChange}
                    errorMessage={
                      type === "bank"
                        ? formErrors.accountNumber
                        : formErrors.cardNumber
                    }
                    style={{
                      border:
                        type === "bank"
                          ? formErrors.accountNumber
                            ? "1px solid #FF0000"
                            : ""
                          : formErrors.cardNumber
                          ? "1px solid #FF0000"
                          : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
                <div className="tw-w-full">
                  <Input
                    type={"text"}
                    name={"bankName"}
                    label={"Bank Name"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.bankName}
                    style={{
                      border: formErrors.bankName ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
                {type === "bank" && (
                  <div className="tw-w-full">
                    <Input
                      type={"number"}
                      name={"ifsc"}
                      label={"IFSC"}
                      onChange={handleInputChange}
                      errorMessage={formErrors.ifsc}
                      style={{
                        border: formErrors.ifsc ? "1px solid #FF0000" : "",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                )}
                <div className="tw-w-full">
                  <SelectDropDown
                    label={"Currency"}
                    value={formValues?.current?.currency}
                    name={"currency"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.currency}
                    style={{
                      border: formErrors.currency ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  >
                    {allCurrencies.map((currencyList) => (
                      <MenuItem
                        key={currencyList.code}
                        value={currencyList.code}
                      >
                        {currencyList.currency}
                      </MenuItem>
                    ))}
                  </SelectDropDown>
                </div>
                <div className="tw-w-full">
                  <TextArea
                    name={"description"}
                    placeholder={"Enter Description here"}
                    label={"Description"}
                    onChange={handleInputChange}
                    errorMessage={formErrors.description}
                    style={{
                      border: formErrors.description ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingBlock: "1rem",
                }}
              >
                <button
                  onClick={handleSubmit}
                  className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
                >
                  Save
                </button>
              </div>
            </div>
          </ModalComponent>
          {/* { modal ending for add new bank } */}

          <CommonTab
            onChange={handleChange}
            value={value}
            tabHeadContent={tabHeadContent}
            buttons={buttons}
          >
            <div className="dashboard">
              <DashboardNavbar
                url={value === "1" && value === "2" && "/addnewexpence"}
                tabLinks={[
                  {
                    name: "Add Expense",
                    url:
                      value === "1"
                        ? "add-new-petty-cash-expense"
                        : `add-new-bank-expense/${selectedBank?._id}`,
                  },
                  { name: "Contra Entry", url: "add-new-contra-entry" },
                ]}
                selectedRow={selectedRow}
                handleNavigation={() =>
                  handleNavigation(
                    `${
                      selectedRow[0]?.expenseCategory === "Contra entry"
                        ? `edit-contra-entry/${selectedRow[0]?.contraId}`
                        : `edit-expense/${selectedRow[0]?._id}`
                    }`
                  )
                }
                handleDelete={() => setOpen(!open)}
                input={value === "1" ? false : input}
              />
            </div>
            <TabPanel
              sx={{ height: "70vh", padding: "0px 3.5rem", marginTop: "10px" }}
              value="1"
            >
              <Table
                columns={columns}
                rows={
                  pettyCashExpenseList?.length >= 0 &&
                  pettyCashExpenseList.map((x, idx) => ({
                    id: x._id,
                    date: x.createdAt,
                    reference: x.referenceNumber,
                    type: x.expenseCategory,
                    deposit:
                      x.expenseCategory === "Purchases"
                        ? x.amount
                        : x.expenseCategory === "Sales"
                        ? "₹0.00"
                        : x.deposit
                        ? "₹" + x.deposit
                        : "₹0.00",
                    withdrawals:
                      x.expenseCategory === "Sales"
                        ? x.amount
                        : x.expenseCategory === "Purchases"
                        ? "₹0.00"
                        : x.amount
                        ? "₹" + x.amount
                        : "₹0.00",
                    runningBalance: "₹" + x.runningBalance,
                  }))
                }
                handleRowClick={handleRowClick}
                listOfItems={pettyCashExpenseList}
                dashboard={false}
              />
            </TabPanel>

            <TabPanel
              value="2"
              sx={{ height: "70vh", padding: "0px 3.5rem", marginTop: "10px" }}
            >
              {bankingList && (
                <Table
                  columns={columns}
                  rows={
                    bankingList?.length >= 0 &&
                    bankingList.map((x, idx) => ({
                      id: x._id,
                      date: x.createdAt,
                      reference: x.referenceNumber,
                      type: x.expenseCategory,
                      deposit: x.deposit ? "₹" + x.deposit : "₹0.00",
                      withdrawals: x.amount ? "₹" + x.amount : "₹0.00",
                      runningBalance: "₹" + x.runningBalance,
                    }))
                  }
                  handleRowClick={handleRowClick}
                  listOfItems={bankingList}
                  dashboard={false}
                />
              )}
            </TabPanel>
          </CommonTab>
        </Box>
      </div>
    </>
  );
}

export default Banking;
