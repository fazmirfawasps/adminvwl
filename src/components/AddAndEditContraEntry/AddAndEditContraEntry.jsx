import * as Yup from "yup";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import SubNavBar from "../SubNavbar/SubNavbar";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { BiRupee, BiSearch } from "react-icons/bi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewContraEntry,
  editContraEntry,
  getAllBanks,
  getAllContraEntry,
  getAllExpenses,
} from "../../services/bankingServices";
import { setBanks } from "../../redux/ducks/bankingSlice";
import dayjs from "dayjs";

const schema = Yup.object().shape({
  fromAccount: Yup.string().required("From account is required"),
  toAccount: Yup.string().required("To account is required"),
  date: Yup.string().required("Date is required"),
  amount: Yup.string().required("amount is required"),
  reference: Yup.string().required("Reference is required"),
  description: Yup.string().required("Description is required"),
});

const AddAndEditContraEntry = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formValues = useRef();
  // const filteredBanks = useRef();
  const AllAccountList = useRef();

  const [date, setDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [fromAccountInputValue, setFromAccountInputValue] = useState("");
  const [toAccountInputValue, setToAccountInputValue] = useState("");
  const [filteredFromAccount, setFilteredFromAccount] = useState([]);
  const [filteredToAccount, setFilteredToAccount] = useState([]);
  const [selectedFromAccount, setSelectedFromAccount] = useState([]);
  const [selectedToAccount, setSelectedToAccount] = useState([]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [selectedContraEntry, setSelectedContraEntry] = useState(null);

  const handleSubmit = async () => {
    try {
      await schema.validate(formValues.current, { abortEarly: false });
      const formData = new FormData();
      Object.keys(formValues.current).forEach((key) => {
        formData.append(key, formValues.current[key]);
      });
      formData.append("selectedFromId", selectedFromAccount[0]?._id);
      formData.append("selectedToId", selectedToAccount[0]?._id);

      if (!id) {
        const object = Object.fromEntries(formData.entries());
        await addNewContraEntry(object);
      } else {
        const object = Object.fromEntries(formData.entries());
        await editContraEntry(object);
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

    if (selectedContraEntry?.length) {
      const items = { ...selectedContraEntry[0], [name]: value };
      setSelectedContraEntry([items]);
    }

    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
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

  const handleFilteringFromAccount = (event) => {
    setSelectedFromAccount([]);
    const input = event.target.value;
    setFromAccountInputValue(input);

    // Filter options by input
    const filterableAccounts = selectedToAccount?.length
      ? AllAccountList?.current?.filter(
          (x) => x._id !== selectedToAccount[0]?._id
        )
      : AllAccountList?.current;

    const filtered = filterableAccounts?.filter((option) => {
      const name = option.bankName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredFromAccount(filtered);
    const e = {
      target: {
        name: "fromAccount",
        value: "",
      },
    };
    handleInputChange(e);
  };
  const handleFilteringToAccount = (event) => {
    setSelectedToAccount([]);
    const input = event.target.value;
    setToAccountInputValue(input);

    // Filter options by input
    const filterableAccounts = selectedFromAccount?.length
      ? AllAccountList?.current?.filter(
          (x) => x._id !== selectedFromAccount[0]?._id
        )
      : AllAccountList?.current;

    const filtered = filterableAccounts?.filter((option) => {
      const name = option.bankName;
      return name.toLowerCase().includes(input.toLowerCase());
    });

    setFilteredToAccount(filtered);
    const e = {
      target: {
        name: "toAccount",
        value: "",
      },
    };
    handleInputChange(e);
  };

  const handleInputClick = (inpId, value) => {
    if (value === "fromAccount") {
      if (selectedToAccount?.length) {
        setFilteredFromAccount(
          AllAccountList?.current?.filter(
            (x) => x._id !== selectedToAccount[0]?._id
          )
        );
      } else {
        setFilteredFromAccount(AllAccountList?.current);
      }
      setShowFrom(!showFrom);
    }
    if (value === "toAccount") {
      if (selectedFromAccount?.length) {
        setFilteredToAccount(
          AllAccountList?.current?.filter(
            (x) => x._id !== selectedFromAccount[0]?._id
          )
        );
      } else {
        setFilteredToAccount(AllAccountList?.current);
      }
      setShowTo(!showTo);
    }
  };

  const assignSelectValue = async (bank, inp, value) => {
    let event;
    if (value === "fromAccount") {
      event = {
        target: {
          name: "fromAccount",
          value: bank.bankName,
        },
      };

      setSelectedFromAccount([bank]);
      setFromAccountInputValue(bank.bankName);
      setFilteredToAccount(
        AllAccountList?.current?.filter((x) => x._id !== bank._id)
      );
      setShowFrom(!showFrom);
    }

    if (value === "toAccount") {
      event = {
        target: {
          name: "toAccount",
          value: bank.bankName,
        },
      };

      setSelectedToAccount([bank]);
      setToAccountInputValue(bank.bankName);
      setFilteredFromAccount(
        AllAccountList?.current?.filter((x) => x._id !== bank._id)
      );
      setShowTo(!showTo);
    }

    await handleInputChange(event);
  };

  useEffect(() => {
    (async () => {
      const banksList = await getAllBanks();
      const pettyOption = [
        { bankName: "Petty cash", _id: "649021a03845891ff0ffd50b" },
      ];

      AllAccountList.current = pettyOption.concat(banksList);
      dispatch(setBanks(banksList));

      if (id) {
        const data = await getAllContraEntry();

        const list = data?.filter((x) => x._id === id);

        if (!list.length) {
          navigate("/not-found");
        } else {
          formValues.current = list[0];
          setFromAccountInputValue(list[0]?.fromAccount);
          setToAccountInputValue(list[0]?.toAccount);
          setDate(dayjs(new Date(list[0]?.date)));

          formValues.current = {
            ...formValues.current,
            prevAmount: list[0]?.amount,
          };

          if (list[0]?.fromAccount === "Petty cash") {
            setSelectedFromAccount(pettyOption);
            formValues.current = {
              ...formValues.current,
              prevFromAccountId: list[0]?.fromAccountId,
              prevFromAccount: list[0]?.fromAccount,
            };
          } else {
            setSelectedFromAccount(
              banksList?.filter((x) => x._id === list[0]?.fromAccountId)
            );

            formValues.current = {
              ...formValues.current,
              prevFromAccountId: list[0]?.fromAccountId,
              prevFromAccount: list[0]?.fromAccount,
            };
          }

          if (list[0]?.toAccount === "Petty cash") {
            setSelectedToAccount(pettyOption);
            formValues.current = {
              ...formValues.current,
              prevToAccountId: list[0]?.toAccountId,
              prevToAccount: list[0]?.toAccount,
            };
          } else {
            setSelectedToAccount(
              banksList?.filter((x) => x._id === list[0]?.toAccountId)
            );

            formValues.current = {
              ...formValues.current,
              prevToAccountId: list[0]?.toAccountId,
              prevToAccount: list[0]?.toAccount,
            };
          }
        }
      }
    })();
  }, [dispatch, id]);

  return (
    <div className="tw-relative tw-mt-16 tw-bg-white">
      {/* section header starting from here */}
      <SubNavBar
        leftText={`${id ? "Edit contra entry" : "Contra entry"}`}
        buttons={buttons}
        fullBorder={true}
      />
      {/* section header starting ending */}

      {/* form staring */}
      <form className="tw-px-14 tw-py-8 tw-mt-12 tw-bg-white">
        <div className="tw-grid md:tw-grid-cols-12 md:tw-grid-flow-row tw-gap-10">
          <div className="tw-col-span-4">
            {/* From account input  */}
            <div className="tw-pb-4">
              <label>From account</label>
              <div className="relative">
                <input
                  id="inp-select"
                  autoComplete="off"
                  name={"fromAccount"}
                  onClick={() =>
                    handleInputClick(
                      "from--account--select--list",
                      "fromAccount"
                    )
                  }
                  className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                    formErrors.fromAccount
                      ? "tw-border tw-border-[#FF0000]"
                      : "tw-border"
                  }`}
                  type="text"
                  placeholder="Select account"
                  value={fromAccountInputValue}
                  onChange={(e) => handleFilteringFromAccount(e)}
                />
                <span className="tw-relative tw-z-0">
                  <BiSearch className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                </span>
                <span className="tw-relative tw-z-0">
                  <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                </span>
                <div className="tw-relative">
                  {filteredFromAccount?.length > 0 && showFrom && (
                    <ul
                      id="from--account--select--list"
                      className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                    >
                      {filteredFromAccount.map((bank, idx) => (
                        <li
                          key={idx}
                          className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                          onClick={(e) =>
                            assignSelectValue(
                              bank,
                              "from--account--select--list",
                              "fromAccount"
                            )
                          }
                        >
                          {bank.bankName}
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

            {/* {Reference} */}
            <div className="tw-pb-4">
              <Input
                name={"reference"}
                type={"number"}
                label={"Reference #"}
                value={formValues?.current?.reference}
                onChange={handleInputChange}
                errorMessage={formErrors.reference}
                style={{
                  border: formErrors.reference ? "1px solid #FF0000" : "",
                  height: "27px",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          <div className="tw-col-span-8 tw-max-w-3xl">
            <div className="tw-flex">
              <div className="tw-w-3/6">
                {/* To account_input  */}
                <div className="tw-pb-4">
                  <label>To account</label>
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      name={"toAccount"}
                      onClick={() =>
                        handleInputClick("to--account-select-list", "toAccount")
                      }
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                        formErrors.toAccount
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
                      placeholder="Select account"
                      value={toAccountInputValue}
                      onChange={(e) => handleFilteringToAccount(e)}
                    />
                    <span className="tw-relative tw-z-0">
                      <BiSearch className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                    </span>
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {filteredToAccount?.length > 0 && showTo && (
                        <ul
                          id="to--account-select-list"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {filteredToAccount.map((bank, idx) => (
                            <li
                              key={idx}
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={(e) =>
                                assignSelectValue(
                                  bank,
                                  "to--account-select-list",
                                  "toAccount"
                                )
                              }
                            >
                              {bank.bankName}
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
              <div className="tw-w-3/6">
                {/* Amount_input  */}
                <div className="Amount_input tw-pb-4">
                  <label>Amount</label>
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      name={"amount"}
                      value={formValues?.current?.amount}
                      onChange={handleInputChange}
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                        formErrors.amount
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
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
              </div>
            </div>

            <div className="tw-flex">
              <div className="tw-w-3/6">
                {/* Description*/}
                <TextArea
                  onChange={handleInputChange}
                  name="description"
                  label={"Description"}
                  value={formValues?.current?.description}
                  placeholder={"Description"}
                  style={{
                    border: formErrors?.description
                      ? "1px solid #FF0000"
                      : "2px solid #d6e2d79c;",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAndEditContraEntry;
