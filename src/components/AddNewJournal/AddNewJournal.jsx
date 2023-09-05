import * as Yup from "yup";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import SubNavBar from "../SubNavbar/SubNavbar";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { IoMdSettings, IoIosArrowDown } from "react-icons/io";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { journalEntryStatus } from '../../constants/constants'
import currencyCodes, { country } from "currency-codes";
import { BiRupee } from "react-icons/bi";
import { getAllBanks, getPettyCash } from "../../services/bankingServices";
import { setBanks } from "../../redux/ducks/bankingSlice";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { addChartOfAccounts, addNewJournal, fetchOneJournal, getChartOfAccounts } from "../../services/journalEntryService";
import { AiOutlinePlus } from "react-icons/ai";
import ModalComponent from "../Modal/ModalComponent";
import { setChartOfAccounts } from "../../redux/ducks/chartOfAccountsSlice";


const schema = Yup.object().shape({
    journalStatus: Yup.string().required("journalNumber is required"),
    journalNumber: Yup.string().required("referenceNumber is required"),
    // journalNotes: Yup.string().required("journal Notes  is required"),
    referenceNumber: Yup.string().required("referenceNumber is required"),
    // amount: Yup.string().required('amount field is required')


});

const initialValues = {
    date: "",
    journalNumber: "",
    journalStatus: "",
    referenceNumber: "",
    journalNotes: "",
    currency: "",
    // selectedAccount: "",
    // firstExpense: "",
    // secondExpense: "",
    // firstDebitValue: "",
    // secondDebitValue: "",
    // thirdDebitValue: "",
    // firstCreditValue: "",
    // secondCreditValue: "",
    // thirdCreditValue: "",
};

const chartOfAccountsInitialValues = {
    accountName: "",
    accountDescription: "",
    accountType: "",
    reference: ""
}

const baseStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
};


const modal2Style2 = {
    width: "25%",
};



const AddNewJournal = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState(initialValues)
    const { chartOfAccountList } = useSelector((state) => state.chartOfAccounts)
    // console.log(formValues, 'formvaluessssssssssssssssssssss');
    const [formErrors, setFormErrors] = useState({});
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [receiptDate, setReceiptDate] = useState(null);
    const [currency, setCurrency] = useState([]);
    const [filteredCurrencys,setFilterdcurrencys]=useState(currency)
    const [selectedCurrency, setSelectedCurrency] = useState("")
    const [pettyCash, setPettyCash] = useState([])
    const [firstList, setFirstList] = useState(false)
    const [secondList, setSecondList] = useState(false)
    const [thirdList, setThirdList] = useState(false)
    const [firstValue, setFirstValue] = useState("")
    const [secondValue, setSecondValue] = useState("")
    const [thirdValue, setThirdValue] = useState("")
    const [flag, setFlag] = useState(false);
    const [warning, setWarning] = useState(false)
    const [secondWarning, setSecondWarning] = useState(false)
    const [thirdWarning, setThirdWarning] = useState(false)
    const [chartOfAccounts, setChartofAccounts] = useState([])
    const [secondfilter, setSecondFilter] = useState([])
    const [thirdfilter, setThirdFilter] = useState([])
    const [selectedAccount, setSelectAccount] = useState({})
    const [secondSelectAccount, setSecondSelectAccount] = useState({})
    const [thirdSelectAccount, setThirdSelectAccount] = useState({})
    const [difference, setDifference] = useState(0)
    // const [selectAccountInputValue, setSelectAccountInputValue] = useState("")
    const [open, setOpen] = useState(false);

    const [currencyList, setCurrencyList] = useState(false)
    //this state is for storing first debit value
    const [firstDebitValue, setFirstDebitValue] = useState(0)

    const [secondDebitValue, setSecondDebitValue] = useState(0)

    const [thirdDebitValue, setThirdDebitValue] = useState(0)

    const [firstCreditValue, setFirstCredittValue] = useState(0)

    const [secondCreditValue, setSecondCreditValue] = useState(0)

    const [thirdCreditValue, setThirdCreditValue] = useState(0)

    const [chartOfAccountsValues, setChartofAccountsValues] = useState(chartOfAccountsInitialValues)

    const totalDebitValue = firstDebitValue + secondDebitValue + thirdDebitValue

    const totalCreditValue = firstCreditValue + secondCreditValue + thirdCreditValue

    let differenceAmount = 0;

    differenceAmount = totalDebitValue - totalCreditValue

    let pettyCashStatus = false;


    const { banksList } = useSelector(
        (state) => state.banking
    );

    // const handleSubmit = async () => {
    //     try {
    //         await schema.validate(formValues.current, { abortEarly: false });
    //         const formData = new FormData();
    //         Object.keys(formValues.current).forEach((key) => {
    //             formData.append(key, formValues.current[key]);
    //         });
    //         const object = Object.fromEntries(formData.entries());
    //         await addNewReceipt(object);
    //         goBack();
    //     } catch (error) {
    //         const validationErrors = {};
    //         error.inner.forEach((innerError) => {
    //             validationErrors[innerError.path] = innerError.message;
    //         });
    //         setFormErrors(validationErrors);
    //     }
    // };

    const handleSubmit = async () => {
        try {
            if (differenceAmount != 0) {
                alert("Difference must be zero")
                return
            }
            console.log(differenceAmount, 'differceamount');
            console.log(typeof (differenceAmount));
            // await schema.validate(formValues, { abortEarly: false });
            const formData = new FormData();
            Object.keys(formValues).forEach((key) => {
                formData.append(key, formValues[key]);
            });
            // if(selectedAccount.bankName=='Petty cash'){
            //     console.log('pettycash selected');
            //     pettyCashStatus=true;
            // }else{
            //     console.log('else');
            // }
            formData.append('firstDebitValue', firstDebitValue)
            formData.append('secondDebitValue', secondDebitValue)
            formData.append('thirdDebitValue', thirdDebitValue)
            formData.append('firstCreditValue', firstCreditValue)
            formData.append('secondCreditValue', secondCreditValue)
            formData.append('thirdCreditValue', thirdCreditValue)
            formData.append('totalDebitValue', totalDebitValue)
            formData.append('totalCreditValue', totalCreditValue)
            formData.append('selectedAccount', JSON.stringify(selectedAccount._id))
            formData.append('firstExpense', JSON.stringify(secondSelectAccount._id))
            formData.append('secondExpense', JSON.stringify(thirdSelectAccount._id))
            const object = Object.fromEntries(formData.entries());
            const { data } = await addNewJournal(object, pettyCashStatus)
            if (data.message) {
                navigate('/accounting/journalEntry')
            }
        } catch (error) {
            const validationErrors = {};
            error.inner.forEach((innerError) => {
                validationErrors[innerError.path] = innerError.message;
            });
            setFormErrors(validationErrors);
        }
    }



    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
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

    const handleChangeReceiptDate = (e) => {
        setReceiptDate(e);
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



    const handleInputClick = (inpId) => {
        if (!flag) {
            setFlag(true);
            setFilteredOptions(pettyCash.concat(banksList));
        }
        if (inpId === 'first-tr-list') {
            // console.log('input click');
            setFirstList(!firstList)
            setSecondList(false)
            setThirdList(false)
        } if (inpId === 'second-tr-list') {
            setSecondList(!secondList)
            setFirstList(false)
            setThirdList(false)
        } if (inpId === 'third-tr-list') {
            setThirdList(!thirdList)
            setFirstList(false)
            setSecondList(false)
        }

    };

    const assignSelectValue = (value, inp) => {
        const id = value._id
        if (inp === 'first-tr-list') {
            setFirstList(!firstList)
            setFirstValue(value.bankName)
            setSecondList("")
            setThirdList("")
            setSelectAccount(value)
            const firstFilterList = filteredOptions.filter(x => x._id !== id)
            console.log(chartOfAccounts, 'chartttttttttttttttt');
            setSecondFilter(firstFilterList.concat(chartOfAccountList))
        } if (inp === 'second-tr-list') {
            setSecondList(!secondList)
            setSecondValue(value.bankName)
            setFirstList("")
            setThirdList("")
            const secondFilterLlist = secondfilter.filter(x => x._id !== value?._id)
            setThirdFilter(secondFilterLlist)
            setSecondSelectAccount(value)
        } if (inp === 'third-tr-list') {
            setThirdList(!thirdList)
            setThirdValue(value.bankName)
            setFirstList("")
            setSecondList("")
            setThirdSelectAccount(value)
        }
    }



    // const handleCurrencyChange = (event) => {
    //     const currency = event.target.value;
    //     setSelectedCurrency(currency);
    // };

    const handleBankFiltering = (event, inp) => {
        const input = event.target.value;
        if (inp === 'first-tr-list') {
            setFirstValue(input);
            const filtered = filteredOptions.filter((option) => {
                const name = option.bankName;
                return name.toLowerCase().includes(input.toLowerCase());
            });
            // setFilteredOptions(filtered);
        } if (inp === 'second-tr-list') {
            setSecondValue(input)
            // console.log('herer');
        }
    };




    const handleDebitValue = (event, account, inp) => {
        let value = parseInt(event.target.value) || 0;
        if (inp === 'first-tr-list') {
            if (value > parseInt(account.runningBalance)) {
                setWarning(true)
                setSecondWarning(false)
                setThirdWarning(false)
            } else {
                setWarning(false)
                setSecondWarning(false)
                setThirdWarning(false)
                setFirstDebitValue(value)
            }
        }
        if (inp === 'second-tr-list') {

            if (value > parseInt(firstDebitValue)) {
                setSecondWarning(true)
                setWarning(false)
                setThirdWarning(false)
            } else {
                // const difference = firstDebitValue - value;
                // setDifference(difference);
                setWarning(false)
                setSecondWarning(false)
                setThirdWarning(false)
                setSecondDebitValue(value)
            }
        }
        if (inp === 'third-tr-list') {
            if (value > parseInt(firstDebitValue)) {
                setThirdWarning(true)
                setWarning(false)
                setSecondWarning(false)
            } else {
                // const total = parseInt(difference) - value;
                // setDifference(total);
                setWarning(false)
                setSecondWarning(false)
                setThirdWarning(false)
                setThirdDebitValue(value)
            }
        }
    }

    const handleCreditValue = (event, inp) => {
        let value = parseInt(event.target.value) || 0;
        if (inp === 'first-tr-list') {
            setFirstCredittValue(value)
            // console.log('first');

        }
        if (inp === 'second-tr-list') {
            setSecondCreditValue(value)
            // console.log('second');
        }
        if (inp === 'third-tr-list') {
            setThirdCreditValue(value)
            // console.log('third');
        }


    }

    const handleCurrencyInputClick = () => {
        try {
            setCurrencyList(!currencyList)
        } catch (error) {
            console.log(error);
        }
    }
    const handleCurrencyInputChange = (event) => {
        try {
          const {value}=event.target
          setSelectedCurrency(value)
          const list = currency.filter((option)=>{
            const {currency}=option
            return currency.toLowerCase().includes(value.toLowerCase())
          })
          console.log(list);
          setFilterdcurrencys(list)
        } catch (error) {
          console.log(error);
    
        }
      }

    const handleCurrencyChange = (currency) => {
        try {
            console.log(currency, 'currency');
            setSelectedCurrency(currency.currency);
            setCurrencyList(!currencyList)

            // console.log(event.target.value, 'eventttttttttttttt');
            // console.log('here');
            // const currency = event.target.value;
            // setSelectedCurrency(currency);

        } catch (error) {
            console.log(error);

        }
    }
    const fetchChartOfAccounts = async () => {
        try {
            const { data } = await getChartOfAccounts();
            console.log(data, 'fetch called here');
            dispatch(setChartOfAccounts(data));



        } catch (error) {
            console.log(error);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleModalChange = (event) => {
        const { name, value } = event.target
        setChartofAccountsValues({ ...chartOfAccountsValues, [name]: value })
    }
    const handleModalSubmit = async () => {
        const { data } = await addChartOfAccounts(chartOfAccountsValues)
        // console.log(data, 'response');
        if (data) {
            handleClose()
            setSecondList(!secondList)
            fetchChartOfAccounts()
            // console.log('called ');
        }
    }

    const handleCurrencyInput = (event) => {
        try {
            console.log('here');
            console.log(event.target.value, 'value');
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        const allCurrencies = currencyCodes.data;
        setCurrency(allCurrencies);
        setFilterdcurrencys(allCurrencies)
    }, []);

    useEffect(() => {
        (async () => {
            const banksList = await getAllBanks();
            dispatch(setBanks({ banksList }));
        })()
    }, [dispatch]);

    useEffect(() => {
        (async () => {
            try {
                const data = await getPettyCash();
                setPettyCash(data)
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    useEffect(() => {
        fetchChartOfAccounts()
    }, [])

    useEffect(() => {
        if (id) {
            const getJournalDetails = async (id) => {
                try {
                    const { data } = await fetchOneJournal(id)
                    setSelectAccount(data?.pettyCash?.bankName)

                    // setFirstCredittValue()
                    console.log(data, 'for edit');

                } catch (error) {
                    console.log(error);

                }
            }
            getJournalDetails(id)
        }
    }, [id])
    // const totalDebitValue = parseInt(firstDebitValue) + parseInt(secondDebitValue) + parseInt(thirdDebitValue)
    return (
        <div className="tw-relative tw-mt-16 tw-min-h-screen tw-bg-white">
            {/* section header starting from here */}
            <SubNavBar
                leftText={"Create new receipt"}
                rightText={"Print or Preview"}
                buttons={buttons}
                fullBorder={true}
            />
            {/* section header starting ending */}

            {/* form staring */}
            <form className="tw-px-14 tw-py-8 tw-mt-12 tw-bg-white tw-border-b">
                <div className="tw-grid md:tw-grid-cols-12 md:tw-grid-flow-row tw-gap-10">
                    <div className="tw-col-span-4">
                        {/* Receipt_date_input */}
                        <label className="tw-mb-[6px]"> Date</label>
                        <div className="Receipt_date_input tw-pb-4">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    onChange={(e) => handleChangeReceiptDate(e)}
                                    className="tw-w-full"
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            height: 27,
                                            border: formErrors.receiptDate
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
                        <label className="tw-mb-[6px]">Reference Number</label>
                        <div className="Receipt_date_input tw-pb-4">
                            <Input
                                name={"referenceNumber"}
                                placeholder={"Enter reference Number"}
                                onChange={handleInputChange}
                                value={formValues.referenceNumber}
                                errorMessage={formErrors.referenceNumber}
                                style={{
                                    border: formErrors.referenceNumber ? "1px solid #FF0000" : "",
                                    height: "27px",
                                    fontSize: "12px",
                                }}
                            />
                        </div>
                        <div className="relative">
                            <input
                                autoComplete="off"
                                name={"amount"}
                                // onChange={handleInputChange}
                                value={selectedCurrency}
                                className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] tw-cursor-pointer ${formErrors.amount
                                    ? "tw-border tw-border-[#FF0000]"
                                    : "tw-border"
                                    }`}
                                type="text"
                                placeholder="Enter Currency"
                                onClick={handleCurrencyInputClick}
                                onChange={(event) => handleCurrencyInputChange(event)}

                            />
                            <span className="tw-relative tw-z-0">
                                <span className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-font-thin tw-rounded-r tw-p-1.5 tw-px-3 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40">
                                    <BiRupee className="" />
                                </span>
                            </span>
                            <span className="tw-relative tw-z-0">
                                <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#8153E2] tw-z-40 cursor-pointer " />
                            </span>
                            <div className="tw-relative">
                                {currencyList && (
                                    <ul
                                        id="inp-select-list"
                                        className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                                    >
                                        {filteredCurrencys.map((currency) => {
                                            return (

                                                <li
                                                    className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                                    key={currency.code}
                                                    value={currency.code}
                                                    onClick={() => handleCurrencyChange(currency)}
                                                >
                                                    {currency.currency}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="tw-col-span-8 tw-max-w-3xl">
                        <div className="tw-flex">
                            <div className="tw-w-3/6 tw-pb-4">
                                {/* Receipt_input */}
                                <label>Journal Number</label>
                                <input
                                    name="journalNumber"
                                    className={`tw-h-[27px] tw-mt-[6px] tw-text-[12px]`}
                                    type="text"
                                    placeholder="SLA-0001"
                                />
                                <span className="tw-relative tw-z-0">
                                    <IoMdSettings className="tw-absolute tw-bottom-[2px] tw-left-[-28px] tw-text-[#8153E2] tw-z-40" />
                                </span>
                            </div>
                            <div className="tw-w-2/6 tw-ml-5 tw-pr-12 tw-pt-[24px]">
                                {/* Status_input */}
                                <div className="Status_input tw-mb-4]">
                                    <SelectDropDown
                                        name={"journalStatus"}
                                        onChange={handleInputChange}
                                        errorMessage={formErrors.journalStatus}
                                        style={{
                                            border: formErrors.journalStatus ? "1px solid #FF0000" : "",
                                            fontSize: "12px",
                                            height: "27px",
                                        }}
                                    >
                                        {journalEntryStatus.map((taxpreference) => (
                                            <MenuItem value={taxpreference.value}>
                                                {taxpreference.value}
                                            </MenuItem>
                                        ))}
                                    </SelectDropDown>
                                </div>
                            </div>
                        </div>
                        <div className="tw-mb-[6px]" style={{ width: "50%" }} >
                            <TextArea
                                onChange={handleInputChange}
                                name="journalNotes"
                                label={"Notes"}
                                value={formValues.journalNotes}
                                placeholder={"Journal Notes"}
                                style={{
                                    // border: formErrors.journalNotes
                                    //     ? "1px solid #FF0000"
                                    //     : "2px solid #d6e2d79c;",
                                    fontSize: "12px",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* form ending */}
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
                                ACCOUNT
                            </th>
                            <th
                                scope="col"
                                className="tw-px-4 tw-w-28 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                            >
                                DESCRIPTION
                            </th>
                            <th
                                scope="col"
                                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                            >
                                CONTACT
                            </th>
                            <th
                                scope="col"
                                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                            >
                                DEBITS
                            </th>
                            <th
                                scope="col"
                                className="tw-px-4 tw-pt-2 tw-border-r tw-text-xs tw-text-center"
                            >
                                CREDITS
                            </th>
                            <th scope="col" className="tw-px-4 tw-pt-2"></th>
                        </tr>
                    </thead>
                    <tbody>
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
                                    <input
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        autoComplete="off"
                                        type="text"
                                        name="selectedAccount"
                                        placeholder="SELECT ACCOUNT"
                                        value={firstValue}
                                        onClick={() => handleInputClick("first-tr-list")}
                                        onChange={(event) => handleBankFiltering(event, "first-tr-list")}
                                    />
                                </div>
                                <div>
                                    {firstList ? (
                                        <ul
                                            id="first-tr-list"
                                            className="tw-absolute tw-w-80 tw-bg-white tw-z-30 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48"
                                        >
                                            {filteredOptions.map((account, idx) => (
                                                <li
                                                    key={idx}
                                                    className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                                    value={account?._id}
                                                    onClick={(e) =>
                                                        assignSelectValue(account, "first-tr-list")
                                                    }
                                                >
                                                    {account.bankName}
                                                </li>
                                            ))}

                                        </ul>
                                    ) : null}
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        type="number"
                                        placeholder="description"

                                    />
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input

                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        type="number"
                                        placeholder="SELECT CONTACT"
                                    />
                                </div>
                            </td>
                            <td className="tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <div className="tw-relative">

                                        <input
                                            // name={x?.receipt}
                                            // onChange={(e) => handleMath(e, x?._id)}
                                            className="tw-w-24
                                            tw-border-none
                                            focus:tw-outline-none"
                                            type="number"
                                            placeholder="Debits"
                                            onChange={(event) => handleDebitValue(event, selectedAccount, 'first-tr-list')}
                                        />
                                        {warning && (
                                            <h3 className="tw-absolute tw-bottom-7 tw-left-27.7 tw-text-red-500 tw-w-44 tw-text-xs">
                                                Please enter a valid amount
                                            </h3>
                                        )}

                                    </div>
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        name="firstCreditValue"
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        type="number"
                                        placeholder="0.00"
                                        onChange={(event) => handleCreditValue(event, 'first-tr-list')}
                                    />
                                </div>
                            </td>
                            <td></td>
                        </tr>
                        {/* //second tr */}

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
                                    <input
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        autoComplete="off"
                                        type="text"
                                        name="firstExpense"
                                        placeholder="SELECT ACCOUNT"
                                        value={secondValue}
                                        onClick={() => handleInputClick("second-tr-list")}
                                        onChange={(event) => handleBankFiltering(event, "second-tr-list")}

                                    />
                                </div>
                                <div>
                                    {secondList ? (
                                        <ul
                                            id="second-tr-list"
                                            className="tw-absolute tw-w-80 tw-bg-white tw-z-30 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48"
                                        >
                                            {secondfilter.map((account, idx) => (
                                                <li
                                                    key={idx}
                                                    className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                                    value={account?._id}
                                                    onClick={(e) =>
                                                        assignSelectValue(account, "second-tr-list")
                                                    }
                                                >
                                                    {account?.bankName}
                                                </li>

                                            ))}
                                            <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]"
                                                onClick={handleOpen}
                                            >
                                                <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add
                                                New Chart of Accounts
                                            </li>
                                            <ModalComponent
                                                title={'Add New Chart Of Accounts'}
                                                open={open}
                                                fade={open}
                                                onClose={handleClose}
                                                style={{ ...baseStyle, ...modal2Style2 }}
                                            >
                                                <div className="tw-px-6 tw-py-3">
                                                    <div className="tw-w-full">
                                                        <Input
                                                            type={"text"}
                                                            name={"accountName"}
                                                            label={"Account Name"}
                                                            onChange={handleModalChange}
                                                            value={chartOfAccountsValues.accountName}
                                                            // errorMessage={formErrors.accountName}
                                                            style={{
                                                                // border: formErrors.accountName ? "1px solid #FF0000" : "",
                                                                fontSize: "12px",
                                                                height: "27px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="tw-w-full" >
                                                        <TextArea
                                                            type={"text"}
                                                            name={"accountDescription"}
                                                            label={"Account Description"}
                                                            onChange={handleModalChange}
                                                            value={chartOfAccountsValues.accountDescription}
                                                            // errorMessage={formErrors.accountName}
                                                            style={{
                                                                // border: formErrors.accountName ? "1px solid #FF0000" : "",
                                                                fontSize: "12px",
                                                                height: "2rem",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="tw-w-full">
                                                        <Input
                                                            type={"text"}
                                                            name={"accountType"}
                                                            label={"Account Type"}
                                                            onChange={handleModalChange}
                                                            value={chartOfAccountsValues.accountType}
                                                            // errorMessage={formErrors.accountName}
                                                            style={{
                                                                // border: formErrors.accountName ? "1px solid #FF0000" : "",
                                                                fontSize: "12px",
                                                                height: "27px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="tw-w-full">
                                                        <Input
                                                            type={"text"}
                                                            name={"reference"}
                                                            label={"Reference"}
                                                            onChange={handleModalChange}
                                                            value={chartOfAccountsValues.reference}
                                                            // errorMessage={formErrors.accountName}
                                                            style={{
                                                                // border: formErrors.accountName ? "1px solid #FF0000" : "",
                                                                fontSize: "12px",
                                                                height: "27px",
                                                            }}
                                                        />
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
                                                            onClick={handleModalSubmit}
                                                            className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </ModalComponent>
                                        </ul>
                                    ) : null}
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        // name={x?.receipt}
                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        type="number"

                                    />
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        name="firstExpense"
                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                        tw-border-none
                                        focus:tw-outline-none"
                                        type="number"
                                        placeholder="SELECT CONTACT"
                                    />
                                </div>
                            </td>
                            <td className="tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        // name={x?.receipt}
                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                        tw-border-none
                                         focus:tw-outline-none"
                                        type="number"
                                        placeholder="hi"
                                        onChange={(event) => handleDebitValue(event, secondSelectAccount, 'second-tr-list')}

                                    />

                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <div className="tw-relative">
                                        <input
                                            // name={x?.receipt}
                                            // onChange={(e) => handleMath(e, x?._id)}
                                            className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                            type="number"
                                            placeholder="0.00"
                                            onChange={(event) => handleCreditValue(event, 'second-tr-list')}
                                        />

                                        {secondWarning && (
                                            <h3 className="tw-absolute tw-bottom-9 tw-left-1 tw-text-red-500 tw-w-44 tw-text-xs">
                                                please enter a valid amount
                                            </h3>

                                        )}
                                    </div>
                                </div>
                            </td>

                        </tr>

                        {/* third tr */}

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
                                    <input
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        autoComplete="off"
                                        type="text"
                                        name="secondExpense"
                                        placeholder="SELECT ACCOUNT"
                                        value={thirdValue}
                                        onClick={() => handleInputClick("third-tr-list")}
                                        onChange={(event) => handleBankFiltering(event, "third-tr-list")}

                                    />
                                </div>
                                <div>
                                    {thirdList ? (
                                        <ul
                                            id="third-tr-list"
                                            className="tw-absolute tw-w-80 tw-bg-white tw-z-30 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48"
                                        >
                                            {thirdfilter.map((account, idx) => (
                                                <li
                                                    key={idx}
                                                    className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                                    value={account?._id}
                                                    onClick={(e) =>
                                                        assignSelectValue(account, "third-tr-list")
                                                    }
                                                >
                                                    {account.bankName}
                                                </li>
                                            ))}

                                        </ul>
                                    ) : null}
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        // name={x?.receipt}
                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                         tw-border-none
                                         focus:tw-outline-none"
                                        type="number"

                                    />
                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        // name={x?.receipt}
                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                         tw-border-none
                                          focus:tw-outline-none"
                                        type="number"
                                        placeholder="SELECT CONTACT"
                                    />
                                </div>
                            </td>
                            <td className="tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <input
                                        // name={x?.receipt}
                                        // onChange={(e) => handleMath(e, x?._id)}
                                        className="tw-w-24
                                         tw-border-none
                                            focus:tw-outline-none"
                                        type="number"
                                        onChange={(event) => handleDebitValue(event, thirdSelectAccount, 'third-tr-list')}


                                    />

                                </div>
                            </td>
                            <td className=" tw-border-r">
                                <div className="tw-flex tw-justify-center tw-items-center tw-h-14">
                                    <div className="tw-relative">
                                        <input
                                            // name={x?.receipt}
                                            // onChange={(e) => handleMath(e, x?._id)}
                                            className="tw-w-24
                                        tw-border-none
                                        focus:tw-outline-none"
                                            type="number"
                                            placeholder="0.00"
                                            onChange={(event) => handleCreditValue(event, 'third-tr-list')}
                                        />
                                        {thirdWarning && (
                                            <h3 className="tw-absolute tw-bottom-9 tw-left-1 tw-text-red-500 tw-w-44 tw-text-xs">
                                                please enter a valid amount
                                            </h3>

                                        )}
                                    </div>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                        {/* ) */}
                        {/* )} */}
                    </tbody>
                </table>
            </div>
            <div className="wrapper  tw-w-full tw-flex tw-justify-end" >
                <div className="content-wrapper tw-w-[56%] tw-flex tw-justify-between tw-pr-[12rem] "  >
                    <div className="tw-text-[14px] tw-font-semibold tw-not-italic" >
                        Total Amount
                    </div>
                    <div className="tw-text-[14px] tw-font-semibold tw-not-italic" >
                        <p>{totalDebitValue}</p>
                    </div>
                    <div className="tw-text-[14px] tw-font-semibold tw-not-italic" >
                        <p>{totalCreditValue}</p>
                    </div>
                </div>
            </div>
            <div className="difference-wrapper tw-flex tw-justify-end tw-w-full" >
                <div className="content-wrapper tw-w-[64%] tw-flex tw-justify-around tw-mt-5">
                    <div className="tw-text-[13px] tw-font-semibold tw-not-italic  tw-text-red-600" >
                        <p>Difference :</p>
                    </div>
                    <div className="tw-text-[14px] tw-font-semibold tw-not-italic  tw-text-red-600" >
                        <p> {differenceAmount}</p>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default AddNewJournal;
