import { Button, FormHelperText, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./AddNewCustomer.css";
import { State, City } from "country-state-city";
import currencyCodes from "currency-codes";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewCustomer,
  fetchOneCustomer,
} from "../../services/customerServices";
import * as Yup from "yup";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import SubNavbar from "../SubNavbar/SubNavbar";
import { taxPreferences, paymentTermses } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { setCountryCode } from "../../redux/ducks/countrySlice";
import { MdOutlineCancel } from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
      "Invalid email address format"
    ),
  deliveryAddressPostalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be a 6-digit number")
    .required("Pincode is required"),
  billingAddressPostalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be a 6-digit number")
    .required("Pincode is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number is invalid")
    .required("Mobile number is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{10,12}$/, "Phone number is invalid")
    .required("Phone number is required"),
  companyAddress: Yup.string().required("address is required"),
  companyName: Yup.string().required("company Name is required"),
  bankAccountDetails: Yup.string().required("Bank Account Details is required"),
  website: Yup.string().required("required"),
  city: Yup.string().required("required"),
  industry: Yup.string().required("required"),
  financialYear: Yup.string().required("required"),
  dateFormat: Yup.string().required("required"),
  billingAddress: Yup.string().required("required"),
  deliveryAddress: Yup.string().required("required"),
  website: Yup.string().required("required"),
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
});

const initialValues = {
  customerType: "Business",
  companyName: "",
  email: "",
  website: "",
  taxPreference: "",
  paymentTerms: "",
  billingAddress: "",
  billingAddressPostalCode: "",
  deliveryAddress: "",
  deliveryAddressPostalCode: "",
  image: null,
  firstName: "",
  lastName: "",
  customerPhone1: "",
  customerPhone2: "",
  mobile: "",
  currency: null,
  placeOfSupplyCity: "",
  placeOfSupplyArea: "",
  billingAddressCity: "",
  billingAddressState: "",
  billingAddressContactNumber: "",
  deliveryAddressCity: "",
  deliveryAddressState: "",
  deliveryAddressContactNumber: "",
};
const folderName = "Customers";
const AddNewCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //store country id
  const [selectedCountryId, setSelectedCountryId] = useState("");

  //manage state
  const [statesList, setStates] = useState([]);

  const [filterdStateList, setFilterdStateList] = useState(statesList);

  const selectedCountryCode = useSelector((state) => state.country.countryCode);
  //storea all the form Values
  const [formValues, setFormValues] = useState(initialValues);
  //store all the currency
  const [currency, setCurrency] = useState([]);
  const [filteredCurrencys, setFilterdcurrencys] = useState(currency);
  //handle form errors on client
  const [formErrors, setFormErrors] = useState({});
  //handle api errors
  const [apiError, setApiError] = useState([]);
  //store currency
  const [selectedCurrency, setSelectedCurrency] = useState("");
  //managing checkbox
  // const [checkbox, setCheckBox] = useState(false);
  const [image, setImage] = useState({});
  //store the selected state
  const [selectState, setSelectState] = useState("");

  //store the citys
  const [cities, setCityName] = useState([]);
  const [billingAddressCityList, setBillingAddressCityList] = useState([]);
  console.log(billingAddressCityList, "the list");
  const [filterdBillingAddressCityList, setFilterdBillingAddressCityList] =
    useState(billingAddressCityList);
  // console.log(filterdBillingAddressCityList,'the city list');
  const [deliveryAddressCityList, setDeliveryAddressCityList] = useState([]);

  const [billingAddressStateList, setBillingAddressStateList] = useState([]);
  const [filterdBillingAddressStateList, setFilterdbillingAddressStateList] =
    useState(billingAddressStateList);
  const [deliveryAdddressStateList, setDeliveryAddressStateList] = useState([]);
  //selected tax preference
  const [selectedTaxPreference, setSelectedTaxPreference] = useState("");
  //selected paymentTerms
  const [selectPaymentTerms, setSelectedPaymentTerms] = useState("");
  //selcted radio button
  const [customerType, setCustomerType] = useState("Business");
  const [isChecked, setIsChecked] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [currencyList, setCurrencyList] = useState(false);
  const [placeOfSupplyState, setPlaceOfSupplyState] = useState(false);
  const [billingAddressState, setBillingAddressState] = useState(false);
  const [billingAddressCityState, setBillingAddressCityState] = useState(false);
  const [deliveryAddressState, setDeliveryAddressState] = useState(false);
  const [deliveryAddressCityState, setDeliveryAddressCityState] =
    useState(false);
  const [selectedPlaceOfSupply, setSelectedPlaceOfSupply] = useState({});
  const [selectedBillingAddressState, setSelectedBillingAddressState] =
    useState({});
  const [selectedBillingAddressCity, setSelectedBillingAddressCity] = useState(
    {}
  );
  const [selectedDeliveryAddressState, setSelectDelilveryAddressState] =
    useState({});
  const [selectedDeliveryAddressCity, setDeliveryAddressCity] = useState({});

  // const [states, setStates] = useState([]);

  const handleCustomerTypeChange = (event) => {
    setCustomerType(event.target.value);
    setFormValues({ ...formValues, customerType: customerType });
  };

  const handleImageCancel = () => {
    setFormValues({ ...formValues, image: null, imageKey: Date.now() });
    setImage({});
  };

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

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value.currency);
    setFormValues({ ...formValues, currency: value.currency });
    setCurrencyList(!currencyList);
  };

  const handleTaxPreferenceChange = (event) => {
    const taxPreference = event.target.value;
    setSelectedTaxPreference(taxPreference);
    setFormValues({ ...formValues, taxPreference: taxPreference });
  };

  const handlePaymentTerms = (event) => {
    const paymentTerms = event.target.value;
    setSelectedPaymentTerms(paymentTerms);
    setFormValues({ ...formValues, paymentTerms: paymentTerms });
  };

  const handleStateChange = (event) => {
    const isoCode = event.target.value;
    const cities = City.getCitiesOfState(selectedCountryId, isoCode);
    setSelectState(isoCode);
    setCityName(cities);
  };

  // const handleCityChange = (event) => {
  //   try {
  //     const city = event.target.value;
  //     setSelectedCity(city);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleImageChange = (event) => {
    let previewImage = window.URL.createObjectURL(event.target.files[0]);
    setImage(previewImage);
    setFormValues((prevFormData) => ({
      ...prevFormData,
      image: event.target.files[0],
    }));
  };

  const handleCurrencyInputClick = () => {
    try {
      setCurrencyList(!currencyList);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOfSupply = (event) => {
    const input = event.target.value;
    setSelectedPlaceOfSupply(input);
    const filtered = statesList?.filter((option) => {
      const name = option?.name;
      return name.toLowerCase().includes(input.toLowerCase());
    });
    setFilterdStateList(filtered);
  };

  const handleListValue = (value, setValue, listState, cityState, setCity) => {
    try {
      console.log("jter");
      setValue(value);
      if (cityState) {
        const cities = City.getCitiesOfState(selectedCountryId, value.isoCode);
        cityState(cities);
      }
      listState((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBillingAddressStateChange = (event) => {
    try {
      const { value } = event.target;
      setSelectedBillingAddressState(value);
      const filterdValue = billingAddressStateList.filter((option) => {
        const { name } = option;
        return name.toLowerCase().includes(value.toLowerCase());
      });
      setFilterdbillingAddressStateList(filterdValue);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeliveryAddressStateChange = (event) => {
    try {
      const { value } = event.target;
      setSelectDelilveryAddressState(value);
      const filterdValue = deliveryAdddressStateList.filter((option) => {
        const { name } = option;
        return name.toLowerCase().includes(value.toLowerCase());
      });
      // setDeliveryAddressCity(filterdValue)
    } catch (error) {}
  };

  const handleBillingAddressCityChange = (event) => {
    try {
      const { value } = event.target;
      setSelectedBillingAddressCity(value);
      const list = billingAddressCityList.filter((option) => {
        const { name } = option;
        return name.toLowerCase().includes(value.toLowerCase());
      });
      console.log(list, "the list");
      setFilterdBillingAddressCityList(list);
    } catch (error) {}
  };
  const handleStates = (state, setState) => {
    try {
      setState(!state);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCurrencyInputChange = (event) => {
    try {
      const { value } = event.target;
      setSelectedCurrency(value);
      const list = currency.filter((option) => {
        const { currency } = option;
        return currency.toLowerCase().includes(value.toLowerCase());
      });
      setFilterdcurrencys(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      // await schema.validate(formValues, { abortEarly: false });
      const { firstName, email, image, lastName, mobile, phone } = formValues;
      const formDataObj = new FormData();
      if (isChecked) {
        formValues.deliveryAddress = formValues.billingAddress;
        formValues.zipPostalCode = formValues.postalCode;
      }
      Object.keys(formValues).forEach((key) => {
        formDataObj.append(key, formValues[key]);
      });
      const payload = {
        placeOfSupplyState: JSON.stringify(selectedPlaceOfSupply),
        billingAddressCity: JSON.stringify(selectedBillingAddressCity),
        billingAddressState: JSON.stringify(selectedBillingAddressState),
        deliveryAddressCity: JSON.stringify(selectedDeliveryAddressCity),
        deliveryAddressState: JSON.stringify(selectedDeliveryAddressState),
      };
      const payloadString = JSON.stringify(payload);
      formDataObj.append("payload", payloadString);
      formDataObj.append(
        "placeOfSupplyState",
        JSON.stringify(selectedPlaceOfSupply)
      );
      formDataObj.append(
        "billingAddressCity",
        JSON.stringify(selectedBillingAddressCity)
      );
      formDataObj.append(
        "billingAddressState",
        JSON.stringify(selectedBillingAddressState)
      );
      formDataObj.append(
        "deliveryAddressCity",
        JSON.stringify(selectedDeliveryAddressCity)
      );
      formDataObj.append(
        "deliveryAddressState",
        JSON.stringify(selectedDeliveryAddressState)
      );

      if (id) {
        const { data } = await addNewCustomer(formDataObj, id);
        console.log(data, "dataaaa");
      } else {
        const { data } = await addNewCustomer(formDataObj);
        navigate("/sales/customers");
      }
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((innerError) => {
        validationErrors[innerError.path] = innerError.message;
      });
      setFormErrors(validationErrors);
    }
  };

  useEffect(() => {
    const allCurrencies = currencyCodes.data;
    setCurrency(allCurrencies);
    setFilterdcurrencys(allCurrencies);
  }, []);

  useEffect(() => {
    setCustomerType("Business");
  }, []);

  useEffect(() => {
    const storedCountryCode = localStorage.getItem("selectedCountryId");
    if (storedCountryCode) {
      // Dispatch the stored country code to the Redux store
      dispatch(setCountryCode(storedCountryCode));
    }
  }, [dispatch, selectedCountryCode]);

  useEffect(() => {
    if (id) {
      const getUserDetails = async (id) => {
        try {
          const { data } = await fetchOneCustomer(id);
          setFormValues(data);
          const images = `http://localhost:8000/images/${folderName}/${data.image}`;
          setImage(images);
        } catch (error) {
          console.log(error);
        }
      };
      getUserDetails(id);
    }
  }, [id]);

  useEffect(() => {
    setSelectedCountryId(selectedCountryCode);
    const states = State.getStatesOfCountry(selectedCountryCode);
    setStates(states);
    setFilterdStateList(states);
    setBillingAddressStateList(states);
    setFilterdbillingAddressStateList(states);
    setDeliveryAddressStateList(states);
  }, [selectedCountryCode]);

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

  return (
    <>
      <div className="tw-relative tw-mt-16 tw-bg-white">
        <SubNavbar
          leftText={"create new client"}
          buttons={buttons}
          fullBorder={true}
        />
        <main className="tw-px-14 tw-py-8 tw-mt-12">
          <div className="add-new-customer-container">
            <div className="left-container-wrapper">
              <div className="checkbox-content-wrapper">
                <div className="label-div" style={{ width: "100%" }}>
                  <label htmlFor="">Customer Type</label>
                </div>
                <div
                  className="checkbox-btn"
                  style={{ display: "flex", marginTop: "8px", width: "60%" }}
                >
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <input
                      type="radio"
                      className="item_input"
                      name="option"
                      onChange={handleCustomerTypeChange}
                      value="Business"
                      checked={customerType === "Business"}
                      style={{ cursor: "pointer" }}
                    />
                    <div>
                      <label>Business</label>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <input
                      type="radio"
                      name="option"
                      checked={customerType === "Individual"}
                      onChange={handleCustomerTypeChange}
                      value="Individual"
                      style={{ cursor: "pointer" }}
                    />
                    <label>Individual</label>
                  </div>
                </div>
              </div>

              <Input
                label={"Company Name"}
                type={"text"}
                placeholder={"Enter Company Name"}
                name={"companyName"}
                onChange={handleInputChange}
                value={formValues.companyName}
                errorMessage={formErrors.companyName}
                style={{
                  border: formErrors.companyName
                    ? "1px solid #FF0000"
                    : "1px solid #0000003b",
                  height: "27px",
                  fontSize: "12px",
                }}
              />
              <Input
                label={"Custsomer Email"}
                type={"email"}
                placeholder={"Enter Email"}
                name={"email"}
                value={formValues.email}
                onChange={handleInputChange}
                errorMessage={formErrors.email}
                style={{
                  border: formErrors.email
                    ? "1px solid #FF0000"
                    : "1px solid #0000003b",
                  fontSize: "12px",
                  height: "27px",
                }}
              />
              <Input
                label={"Customer Website"}
                type={"text"}
                placeholder={"Enter Website"}
                name={"website"}
                value={formValues.website}
                onChange={handleInputChange}
                errorMessage={formErrors.website}
                style={{
                  border: formErrors.website
                    ? "1px solid #FF0000"
                    : "1px solid #0000003b",
                  fontSize: "12px",
                  height: "27px",
                }}
              />
              <SelectDropDown
                label={"Tax preference"}
                value={selectedTaxPreference}
                onChange={handleTaxPreferenceChange}
                // value={formValues.taxPreference}
                style={{
                  fontSize: "12px",
                  height: "27px",
                }}
              >
                {taxPreferences.map((taxpreference) => (
                  <MenuItem value={taxpreference.value}>
                    {taxpreference.value}
                  </MenuItem>
                ))}
              </SelectDropDown>
              <SelectDropDown
                label={"Payment Terms"}
                value={selectPaymentTerms}
                onChange={handlePaymentTerms}
                errorMessage={formErrors.paymentTerms}
                style={{
                  border: formErrors.paymentTerms ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                  height: "27px",
                }}
              >
                {paymentTermses.map((paymentTerms) => (
                  <MenuItem value={paymentTerms.value}>
                    {paymentTerms.value}
                  </MenuItem>
                ))}
              </SelectDropDown>
              <div className="compony-address">
                <label htmlFor="">Billing Address</label>
                {/* <FormHelperText sx={{ color: "red" }}>
                  {formErrors.billingAddress
                    ? formErrors.billingAddress
                    : apiError.billingAddress}
                </FormHelperText> */}
                <textarea
                  style={{
                    height: "73px",
                    border: formErrors?.billingAddress
                      ? "1px solid #FF0000"
                      : apiError?.mobile
                      ? "1px solid #FF0000"
                      : "1px solid #0000003b",
                  }}
                  name="billingAddress"
                  placeholder="Address"
                  value={formValues.billingAddress}
                  onChange={handleInputChange}
                ></textarea>
                <Input
                  placeholder={"Zip/Postal Code"}
                  name={"billingAddressPostalCode"}
                  onChange={handleInputChange}
                  value={formValues.billingAddressPostalCode}
                  type={"number"}
                  errorMessage={formErrors.billingAddressPostalCode}
                  style={{
                    border: formErrors.billingAddressPostalCode
                      ? "1px solid #FF0000"
                      : "1px solid #0000003b",
                    fontSize: "12px",
                    height: "30px",
                  }}
                />
              </div>
              <div
                className="delivery-address"
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  className="checkbox"
                  style={{ width: "100%", display: "flex", gap: "6px" }}
                >
                  <div
                    className="label-div"
                    style={{ width: "50%", display: "flex" }}
                  >
                    <label htmlFor="">Delivery Address</label>
                  </div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={{
                        width: "15px",
                        height: "15px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "11px" }}>
                    Same as Billing address
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <TextArea
                    name={"deliveryAddress"}
                    placeholder={"Address"}
                    value={
                      isChecked
                        ? formValues.billingAddress
                        : formValues.deliveryAddress
                    }
                    onChange={handleInputChange}
                    errorMessage={formErrors.deliveryAddress}
                    style={{
                      border: formErrors.deliveryAddress
                        ? "1px solid #FF0000"
                        : "1px solid #0000003b",
                      fontSize: "12px",
                      height: "73px",
                    }}
                  />
                  <Input
                    placeholder={"Zip/Postal Code"}
                    name={"deliveryAddressPostalCode"}
                    onChange={handleInputChange}
                    type={"number"}
                    value={
                      isChecked
                        ? formValues.billingAddressPostalCode
                        : formValues.deliveryAddressPostalCode
                    }
                    errorMessage={formErrors.deliveryAddressPostalCode}
                    style={{
                      border: formErrors.deliveryAddressPostalCode
                        ? "1px solid #FF0000"
                        : "1px solid #0000003b",
                      fontSize: "12px",
                      height: "30px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="right-container-wrapper">
              <div
                className="file-upload"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  position: "relative",
                }}
              >
                <label htmlFor="">Company Logo</label>
                <Button
                  variant="contained"
                  component="label"
                  style={{
                    background: "white",
                    boxShadow: "none",
                    border: "1.5px dotted #8153E2",
                    width: "50%",
                    height: "27px",
                  }}
                >
                  Upload
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    name="image"
                    key={formValues.imageKey}
                    onChange={handleImageChange}
                  />
                </Button>
                <div className="input-right-content-customer">
                  {formValues?.image ? (
                    <>
                      {/* <img className='logo-customer' src={id ? `http://localhost:8000/images/${folderName}/${formValues.image}` : window.URL.createObjectURL(formValues?.image)} /> */}
                      <img className="logo-customer" src={image} />
                      <MdOutlineCancel
                        style={{
                          position: "absolute",
                          top: "1px",
                          right: "12rem",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={handleImageCancel}
                      />
                    </>
                  ) : (
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "10px",
                      }}
                      className="logo-customer"
                    >
                      image
                    </p>
                  )}
                </div>
              </div>

              <div
                className="wrapper"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="label-div" style={{ width: "100%" }}>
                  <label htmlFor="">Primary Contact</label>
                </div>
                <div
                  className="input-firstname"
                  style={{ display: "flex", width: "100%", gap: "20px" }}
                >
                  <div style={{ width: "40%" }}>
                    <Input
                      placeholder={"First Name"}
                      name={"firstName"}
                      onChange={handleInputChange}
                      type={"text"}
                      value={formValues.firstName}
                      errorMessage={formErrors.firstName}
                      style={{
                        border: formErrors.firstName
                          ? "1px solid #FF0000"
                          : "1px solid #0000003b",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                  <div style={{ width: "40%" }}>
                    <Input
                      placeholder={"Last Name"}
                      name={"lastName"}
                      onChange={handleInputChange}
                      type={"text"}
                      value={formValues.lastName}
                      errorMessage={formErrors.lastName}
                      style={{
                        border: formErrors.lastName
                          ? "1px solid #FF0000"
                          : "1px solid #0000003b",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="wrapper"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="label-div" style={{ width: "100%" }}>
                  <label htmlFor="">Customer Phone</label>
                </div>
                <div
                  className="input-phone"
                  style={{ display: "flex", gap: "20px" }}
                >
                  <div style={{ width: "40%" }}>
                    <Input
                      placeholder={"Work Phone 01"}
                      name={"customerPhone1"}
                      onChange={handleInputChange}
                      type={"number"}
                      value={formValues.workPhone1}
                      errorMessage={formErrors.phone}
                      style={{
                        border: formErrors.phone
                          ? "1px solid #FF0000"
                          : "1px solid #0000003b",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                  <div style={{ width: "40%" }}>
                    <Input
                      placeholder={"Work Phone 02"}
                      name={"customerPhone2"}
                      onChange={handleInputChange}
                      type={"number"}
                      value={formValues.workPhone2}
                      errorMessage={formErrors.mobile}
                      style={{
                        border: formErrors.mobile
                          ? "1px solid #FF0000"
                          : "1px solid #0000003b",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="label-div"
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Input
                  placeholder={"Enter Number"}
                  name={"mobile"}
                  label={"Mobile Number"}
                  onChange={handleInputChange}
                  type={"number"}
                  value={formValues.mobile}
                  errorMessage={formErrors.mobile}
                  style={{
                    border: formErrors.mobile
                      ? "1px solid #FF0000"
                      : "1px solid #0000003b",
                    fontSize: "12px",
                    height: "27px",
                  }}
                />
              </div>
              <div className="tw-relative tw-flex tw-flex-col tw-w-1/2 tw-gap-[1px]">
                <label htmlFor="">Currency</label>
                <div className="relative">
                  <input
                    id="inp-select"
                    autoComplete="off"
                    name={"amount"}
                    value={selectedCurrency}
                    onClick={handleCurrencyInputClick}
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-cursor-pointer ${
                      formErrors.amount
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                    placeholder="Enter Currency"
                    onChange={(event) => handleCurrencyInputChange(event)}
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
                <div className="tw-relative">
                  {currencyList && (
                    <ul className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm">
                      {filteredCurrencys?.map((currency) => {
                        return (
                          <li
                            className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                            key={currency.code}
                            value={currency.code}
                            onClick={() => handleCurrencyChange(currency)}
                          >
                            {currency.currency}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              <div
                className="wrapper"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  className="input-place"
                  style={{ display: "flex", gap: "20px" }}
                >
                  <div
                    className="Customer_input"
                    style={{
                      width: "40%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <label>Place of Supply</label>
                    <div className="relative">
                      <input
                        id="inp-select"
                        autoComplete="off"
                        name={"customer"}
                        value={selectedPlaceOfSupply?.name}
                        onClick={() =>
                          handleStates(
                            placeOfSupplyState,
                            setPlaceOfSupplyState
                          )
                        }
                        onChange={(event) => handlePlaceOfSupply(event)}
                        className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                          formErrors.customer
                            ? "tw-border tw-border-[#FF0000]"
                            : "tw-border"
                        }`}
                        type="text"
                        style={{ cursor: "pointer" }}
                      />
                      <span className="tw-relative tw-z-0">
                        <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                      </span>
                      <div className="tw-relative">
                        {placeOfSupplyState && statesList.length > 0 && (
                          <ul
                            id="inp-select-lists"
                            className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                          >
                            {filterdStateList?.map((state) => (
                              <li
                                className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                onClick={() =>
                                  handleListValue(
                                    state,
                                    setSelectedPlaceOfSupply,
                                    setPlaceOfSupplyState
                                  )
                                }
                              >
                                {state.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "40%", marginTop: "21px" }}>
                    <input
                      type="text"
                      style={{ height: "27px", fontSize: "12px" }}
                      id="input"
                      placeholder="Area"
                      name="placeOfSupplyArea"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="Customer_input tw-pb-2 tw-mt-5"
                  style={{ width: "50%" }}
                >
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      value={selectedBillingAddressCity.name}
                      placeholder="City"
                      onClick={() =>
                        handleStates(
                          billingAddressCityState,
                          setBillingAddressCityState
                        )
                      }
                      onChange={(e) => handleBillingAddressCityChange(e)}
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px]  tw-w-full tw-z-[100] ${
                        formErrors.customer
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
                      style={{ cursor: "pointer" }}
                    />
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {billingAddressCityState && (
                        <ul
                          id="inp-select-lists"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {filterdBillingAddressCityList?.map((citie) => (
                            <li
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={() =>
                                handleListValue(
                                  citie,
                                  setSelectedBillingAddressCity,
                                  setBillingAddressCityState
                                )
                              }
                            >
                              {citie.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className="Customer_input " style={{ width: "50%" }}>
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      name={"customer"}
                      value={selectedBillingAddressState?.name}
                      onClick={() =>
                        handleStates(
                          billingAddressState,
                          setBillingAddressState
                        )
                      }
                      onChange={(e) => handleBillingAddressStateChange(e)}
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-my-[10px] tw-w-full tw-z-[100] ${
                        formErrors.customer
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
                      style={{ cursor: "pointer" }}
                    />
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {billingAddressState && (
                        <ul
                          id="inp-select-lists"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {filterdBillingAddressStateList?.map((state) => (
                            <li
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={() =>
                                handleListValue(
                                  state,
                                  setSelectedBillingAddressState,
                                  setBillingAddressState,
                                  setFilterdBillingAddressCityList
                                )
                              }
                            >
                              {state.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ width: "50%" }}>
                  <Input
                    placeholder={"Contact  Number"}
                    name={"billingAddressContactNumber"}
                    onChange={handleInputChange}
                    type={"number"}
                    value={formValues.billingAddressContactNumber}
                    errorMessage={formErrors.mobile}
                    style={{
                      border: formErrors.mobile
                        ? "1px solid #FF0000"
                        : "1px solid #0000003b",
                      fontSize: "12px",
                      height: "30px",
                    }}
                  />
                </div>
              </div>
              <div>
                <div
                  className="Customer_input tw-pb-2 tw-mt-5"
                  style={{ width: "50%" }}
                >
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      name={"customer"}
                      value={selectedDeliveryAddressCity?.name}
                      placeholder="City"
                      onClick={() =>
                        handleStates(
                          deliveryAddressCityState,
                          setDeliveryAddressCityState
                        )
                      }
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px]  tw-w-full tw-z-[100] ${
                        formErrors.customer
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border tw-border-[#0000003b]"
                      }`}
                      type="text"
                      style={{ cursor: "pointer" }}
                    />
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {deliveryAddressCityState && (
                        <ul
                          id="inp-select-lists"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {deliveryAddressCityList.map((citie) => (
                            <li
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={() =>
                                handleListValue(
                                  citie,
                                  setDeliveryAddressCity,
                                  setDeliveryAddressCityState
                                )
                              }
                            >
                              {citie.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className="Customer_input" style={{ width: "50%" }}>
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      name={"customer"}
                      value={selectedDeliveryAddressState?.name}
                      onClick={() =>
                        handleStates(
                          deliveryAddressState,
                          setDeliveryAddressState
                        )
                      }
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-my-[10px] tw-w-full tw-z-[100] ${
                        formErrors.customer
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border tw-border-[#0000003b]"
                      }`}
                      type="text"
                      style={{ cursor: "pointer" }}
                      onChange={(e) => handleDeliveryAddressStateChange(e)}
                    />
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                    </span>
                    <div className="tw-relative">
                      {deliveryAddressState && (
                        <ul
                          id="inp-select-lists"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {deliveryAdddressStateList.map((state) => (
                            <li
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={() =>
                                handleListValue(
                                  state,
                                  setSelectDelilveryAddressState,
                                  setDeliveryAddressState,
                                  setDeliveryAddressCityList
                                )
                              }
                            >
                              {state.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ width: "50%" }}>
                  <Input
                    placeholder={"Contact Number"}
                    name={"deliveryAddressContactNumber"}
                    onChange={handleInputChange}
                    type={"number"}
                    value={formValues.deliveryAddressContactNumber}
                    errorMessage={formErrors.mobile}
                    style={{
                      border: formErrors.mobile
                        ? "1px solid #FF0000"
                        : "1px solid #0000003b",
                      fontSize: "12px",
                      height: "30px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddNewCustomer;
