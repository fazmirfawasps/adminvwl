import { Button, MenuItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "../AddNewCustomer/AddNewCustomer.css";
import { Country, State, City } from "country-state-city";
import currencyCodes from "currency-codes";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewVendor,
  editVendor,
  fetchOneVendor,
} from "../../services/vendorServices";
import * as Yup from "yup";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import SubNavbar from "../SubNavbar/SubNavbar";
import { MdOutlineCancel } from "react-icons/md";
import { getProfile } from "../../services/profileService";
import { IoIosArrowDown } from "react-icons/io";
import { BiRupee } from "react-icons/bi";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
      "Invalid email address format"
    ),
  billingZipOrPostalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Zip/PostalCode must be a 6-digit number")
    .required("Zip/PostalCode is required"),
  deliveryZipOrPostalCode: Yup.string()
    .matches(/^[0-9]{6}$/, "Zip/PostalCode must be a 6-digit number")
    .required("Zip/PostalCode is required"),
  placeOfSupply: Yup.string().required("Place of supply is required"),
  billingState: Yup.string().required("State is required"),
  deliveryState: Yup.string().required("State is required"),
  billingCity: Yup.string().required("City is required"),
  deliveryCity: Yup.string().required("City is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number is invalid")
    .required("Mobile number is required"),
  deliveryContactNumber: Yup.string()
    .matches(/^\+?[0-9]{10,12}$/, "Phone number is invalid")
    .required("Contact number is required"),
  billingContactNumber: Yup.string()
    .matches(/^\+?[0-9]{10,12}$/, "Phone number is invalid")
    .required("Contact number is required"),
  workPhone1: Yup.string()
    .matches(/^\+?[0-9]{10,12}$/, "Phone number is invalid")
    .required("Customer phone is required"),
  workPhone2: Yup.string()
    .matches(/^\+?[0-9]{10,12}$/, "Phone number is invalid")
    .required("Customer phone is required"),
  companyName: Yup.string().required("Company name is required"),
  website: Yup.string().required("Required"),
  billingAddress: Yup.string().required("Billing address is required"),
  deliveryAddress: Yup.string().required("Required"),
  currency: Yup.string().required("Currency is required"),
  taxPreference: Yup.string().required("Tax preference is required"),
  paymentTerms: Yup.string().required("Payment terms is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  area: Yup.string().required("Area is required"),
  image: Yup.string().required("Company logo is required"),
});

const initialValues = {
  companyName: "",
  email: "",
  taxPreference: "",
  paymentTerms: "",
  billingAddress: "",
  deliveryAddress: "",
  deliveryZipOrPostalCode: "",
  billingZipOrPostalCode: "",
  image: null,
  firstName: "",
  lastName: "",
  workPhone1: "",
  workPhone2: "",
  currency: "",
  placeOfSupply: "",
  deliveryState: "",
  billingState: "",
  deliveryCity: "",
  billingCity: "",
  mobileNumber: "",
  billingContactNumber: "",
  deliveryContactNumber: "",
  area: "",
  billingStateIso: "",
  deliveryStateIso: "",
};

const taxPreferences = [{ value: "Taxable" }, { value: "Non-Taxable" }];

const paymentTerms = [
  { value: "Due on receipt" },
  { value: "Due end of the month" },
  { value: "Due next Month" },
];

const initialAddress = {
  billingCity: "",
  billingState: "",
  deliveryCity: "",
  deliveryState: "",
  placeOfSupply: "",
  currency: "",
};

const AddAndEditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formAddress = useRef(initialAddress);

  const [state, setState] = useState("");
  const [image, setImage] = useState({});
  const [edit, setEdit] = useState(false);
  const [country, setCountry] = useState("");
  const [apiError, setApiError] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [vendorType, setVendorType] = useState("Business");
  const [billingCityList, setBillingCityList] = useState("");
  const [formValues, setFormValues] = useState(initialValues);
  const [deliveryCityList, setDeliveryCityList] = useState("");
  const [filteredCurrency, setFilteredCurrency] = useState([]);
  const [filteredBillingCity, setFilteredBillingCity] = useState([]);
  const [filteredBillingState, setFilteredBillingState] = useState([]);
  const [filteredDeliveryCity, setFilteredDeliveryCity] = useState([]);
  const [filteredDeliveryState, setFilteredDeliveryState] = useState([]);
  const [filteredPlaceOfSupply, setFilteredPlaceOfSupply] = useState([]);

  const handleImageCancel = () => {
    setFormValues({ ...formValues, image: null, imageKey: Date.now() });
    setFormErrors((prev) => ({ ...prev, image: "Company logo is required" }));
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

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setIsChecked(checked);
    if (checked) {
      formValues.deliveryAddress = formValues.billingAddress;
      formValues.deliveryZipOrPostalCode = formValues.billingZipOrPostalCode;
      formErrors.deliveryAddress = "";
      formErrors.deliveryZipOrPostalCode = "";
    } else {
      formValues.deliveryAddress = "";
      formValues.deliveryZipOrPostalCode = "";
      formErrors.deliveryAddress = "required";
      formErrors.deliveryZipOrPostalCode = "required";
    }
  };

  const handleImageChange = (event) => {
    setEdit(false);
    let previewImage = window.URL.createObjectURL(event.target.files[0]);
    setImage(previewImage);
    setFormValues((prevFormData) => ({
      ...prevFormData,
      image: event.target.files[0],
    }));
    setFormErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });
      const formDataObj = new FormData();
      Object.keys(formValues).forEach((key) => {
        formDataObj.append(key, formValues[key]);
      });
      formDataObj.append("vendorType", vendorType);
      const object = Object.fromEntries(formDataObj.entries());
      if (id) {
        await editVendor(id, object);
        navigate("/purchases/vendors");
      } else {
        await addNewVendor(formDataObj);
        navigate("/purchases/vendors");
      }
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((innerError) => {
        validationErrors[innerError.path] = innerError.message;
      });
      setFormErrors(validationErrors);
    }
  };

  const handleGetCountry = async (deliveryStateIso, billingStateIso) => {
    const { data } = await getProfile();

    if (data) {
      const { countryCode } = data;

      if (countryCode) {
        const selectedState = State.getStatesOfCountry(countryCode);
        const selectedCountry = Country.getCountryByCode(countryCode);
        setState(selectedState);
        setCountry(selectedCountry);

        if (deliveryStateIso && billingStateIso) {
          setBillingCityList(
            City.getCitiesOfState(selectedCountry?.isoCode, billingStateIso)
          );
          setDeliveryCityList(
            City.getCitiesOfState(selectedCountry?.isoCode, deliveryStateIso)
          );
        }
      }
    }
  };

  useEffect(() => {
    const allCurrencies = currencyCodes.data;
    setCurrency(allCurrencies);
    handleGetCountry();
  }, []);

  useEffect(() => {
    if (id) {
      const getUserDetails = async (id) => {
        try {
          const { data } = await fetchOneVendor(id);

          if (data) {
            const {
              deliveryStateIso,
              billingStateIso,
              billingCity,
              billingState,
              deliveryCity,
              deliveryState,
              placeOfSupply,
              currency,
            } = data;
            await handleGetCountry(deliveryStateIso, billingStateIso);

            setVendorType(data?.vendorType);
            setFormValues(data);
            setImage(data?.image);
            setEdit(true);
            formAddress.current = {
              billingCity,
              billingState,
              deliveryCity,
              deliveryState,
              placeOfSupply,
              currency,
            };
          } else {
            // redirect to 404
          }
        } catch (error) {
          // redirect to 404
          console.log(error);
        }
      };
      getUserDetails(id);
    }
  }, [id]);

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

  const handleChangeState = (x, action, inpId) => {
    if (country) {
      const cities = City.getCitiesOfState(country?.isoCode, x?.isoCode);

      if (action === "billing") {
        formAddress.current.billingState = x?.name;
        formAddress.current.billingCity = "";

        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          billingCity: "",
          billingState: x?.name,
          billingStateIso: x.isoCode,
        }));
        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          billingState: null,
        }));
        setBillingCityList(cities);
      }

      if (action === "delivery") {
        formAddress.current.deliveryState = x?.name;
        formAddress.current.deliveryCity = "";

        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          deliveryCity: "",
          deliveryState: x?.name,
          deliveryStateIso: x.isoCode,
        }));
        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          deliveryState: null,
        }));
        setDeliveryCityList(cities);
      }

      handleInputClick(inpId);
    }
  };

  const handleChangeCity = (x, action, inpId) => {
    if (action === "billing") {
      formAddress.current.billingCity = x?.name;
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        billingCity: x?.name,
      }));
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        billingCity: null,
      }));
    }

    if (action === "delivery") {
      formAddress.current.deliveryCity = x?.name;
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        deliveryCity: x?.name,
      }));
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        deliveryCity: null,
      }));
    }

    handleInputClick(inpId);
  };

  const handleFiltering = (e, location, type, inpId) => {
    const { value } = e.target;

    if (location === "state") {
      const filtered = state?.filter((option) => {
        const { name } = option;
        return name.toLowerCase().includes(value.toLowerCase());
      });

      if (type === "billing") {
        formAddress.current.billingState = value;
        setFilteredBillingState(filtered);
      }
      if (type === "delivery") {
        formAddress.current.deliveryState = value;
        setFilteredDeliveryState(filtered);
      }
    }

    if (location === "city") {
      const cities = type === "billing" ? billingCityList : deliveryCityList;
      const filtered = cities?.filter((option) => {
        const { name } = option;
        return name.toLowerCase().includes(value.toLowerCase());
      });

      if (type === "billing") {
        formAddress.current.billingCity = value;
        setFilteredBillingCity(filtered);
      }
      if (type === "delivery") {
        formAddress.current.deliveryCity = value;
        setFilteredDeliveryCity(filtered);
      }
    }
  };

  const handleInputClick = (inpId, type) => {
    const inp_select = document.getElementById(inpId);
    if (type === "deliveryState") setFilteredDeliveryState(state);
    if (type === "billingState") setFilteredBillingState(state);
    if (type === "billingCity") setFilteredBillingCity(billingCityList);
    if (type === "deliveryCity") setFilteredDeliveryCity(deliveryCityList);
    if (type === "placeOfSupply") setFilteredPlaceOfSupply(state);
    if (type === "currency") setFilteredCurrency(currency);

    inp_select?.classList?.contains("tw-hidden")
      ? inp_select.classList.remove("tw-hidden")
      : inp_select?.classList?.add("tw-hidden");
  };

  const handleFilterPlaceOfSupply = (e) => {
    const { value } = e.target;
    formAddress.current.placeOfSupply = value;

    const filtered = state?.filter((option) => {
      const { name } = option;
      return name.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredPlaceOfSupply(filtered);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      placeOfSupply: "",
    }));
  };
  const handleFilterCurrency = (e) => {
    const { value } = e.target;
    formAddress.current.currency = value;

    const filtered = currency?.filter((option) => {
      const { currency } = option;
      return currency.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredCurrency(filtered);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      currency: "",
    }));
  };

  const handleChangeCurrency = (selectedCurrency) => {
    const { currency } = selectedCurrency;
    formAddress.current.currency = currency;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      currency: currency,
    }));
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      currency: null,
    }));

    handleInputClick("currency__inp");
  };
  const handleChangePlaceOfSupply = (place) => {
    formAddress.current.placeOfSupply = place;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      placeOfSupply: place,
    }));
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      placeOfSupply: null,
    }));

    handleInputClick("place__of__supply");
  };

  return (
    <>
      <div className="tw-relative tw-mt-16 tw-bg-white">
        <SubNavbar
          leftText={`${id ? "Edit vendor" : "Create new vendor"}`}
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
                      className="item_input tw-cursor-pointer"
                      name="option"
                      onClick={(e) => setVendorType("Business")}
                      checked={vendorType === "Business"}
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
                      className="tw-cursor-pointer"
                      onClick={(e) => setVendorType("Individual")}
                      checked={vendorType === "Individual"}
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
                  border: formErrors.companyName ? "1px solid #FF0000" : "",
                  height: "27px",
                  fontSize: "12px",
                }}
              />
              <Input
                label={"Vendor Email"}
                type={"email"}
                placeholder={"Enter Email"}
                name={"email"}
                value={formValues.email}
                onChange={handleInputChange}
                errorMessage={formErrors.email}
                style={{
                  border: formErrors.email ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                  height: "27px",
                }}
              />
              <Input
                label={"Vendor Website"}
                type={"text"}
                placeholder={"Enter Website"}
                name={"website"}
                value={formValues.website}
                onChange={handleInputChange}
                errorMessage={formErrors.website}
                style={{
                  border: formErrors.website ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                  height: "27px",
                }}
              />
              <SelectDropDown
                label={"Tax preference"}
                value={formValues.taxPreference}
                onChange={handleInputChange}
                name={"taxPreference"}
                errorMessage={formErrors.taxPreference}
                style={{
                  border: formErrors.taxPreference ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                }}
              >
                {taxPreferences.map((taxPreference) => (
                  <MenuItem value={taxPreference.value}>
                    {taxPreference.value}
                  </MenuItem>
                ))}
              </SelectDropDown>
              <SelectDropDown
                label={"Payment Terms"}
                value={formValues.paymentTerms}
                name={"paymentTerms"}
                onChange={handleInputChange}
                errorMessage={formErrors.paymentTerms}
                style={{
                  border: formErrors.paymentTerms ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                }}
              >
                {paymentTerms.map((terms) => (
                  <MenuItem value={terms.value}>{terms.value}</MenuItem>
                ))}
              </SelectDropDown>
              <div className="compony-address">
                <TextArea
                  style={{
                    border: formErrors?.billingAddress
                      ? "1px solid #FF0000"
                      : "",
                    fontSize: "12px",
                  }}
                  name="billingAddress"
                  placeholder="Address"
                  label={"Billing Address"}
                  value={formValues.billingAddress}
                  errorMessage={formErrors.billingAddress}
                  onChange={handleInputChange}
                ></TextArea>
                <Input
                  placeholder={"Zip/Postal Code"}
                  name={"billingZipOrPostalCode"}
                  onChange={handleInputChange}
                  value={formValues.billingZipOrPostalCode}
                  type={"number"}
                  errorMessage={formErrors.billingZipOrPostalCode}
                  style={{
                    border: formErrors.billingZipOrPostalCode
                      ? "1px solid #FF0000"
                      : "",
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
                    gap: "20px",
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
                        : "",
                      fontSize: "12px",
                    }}
                  />
                  <Input
                    placeholder={"Zip/Postal Code"}
                    name={"deliveryZipOrPostalCode"}
                    onChange={handleInputChange}
                    type={"number"}
                    value={
                      isChecked
                        ? formValues.billingZipOrPostalCode
                        : formValues.deliveryZipOrPostalCode
                    }
                    errorMessage={formErrors.deliveryZipOrPostalCode}
                    style={{
                      border: formErrors.deliveryZipOrPostalCode
                        ? "1px solid #FF0000"
                        : "",
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
                  gap: "0px",
                  position: "relative",
                }}
              >
                <label
                  className={`${formErrors.image && "tw-text-[#FF0000]"}`}
                  htmlFor=""
                >
                  {formErrors.image ? formErrors.image : "Company Logo"}
                </label>
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
                  <Input
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
                      {id && edit ? (
                        <img
                          className="logo-customer"
                          src={`http://localhost:8000/images/Vendors/${image}`}
                        />
                      ) : (
                        <img className="logo-customer" src={image} />
                      )}
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
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div className="label-div" style={{ width: "100%" }}>
                  <label htmlFor="">Primary Contact</label>
                </div>
                <div
                  className="input-firstname"
                  style={{ display: "flex", gap: "3rem", width: "100%" }}
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
                        border: formErrors.firstName ? "1px solid #FF0000" : "",
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
                        border: formErrors.lastName ? "1px solid #FF0000" : "",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="wrapper"
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div className="label-div" style={{ width: "100%" }}>
                  <label htmlFor="">Customer Phone</label>
                </div>
                <div
                  className="input-phone"
                  style={{ display: "flex", gap: "3rem" }}
                >
                  <div style={{ width: "40%" }}>
                    <Input
                      placeholder={"Work Phone 01"}
                      name={"workPhone1"}
                      onChange={handleInputChange}
                      type={"text"}
                      value={formValues.workPhone1}
                      errorMessage={formErrors.workPhone1}
                      style={{
                        border: formErrors.workPhone1
                          ? "1px solid #FF0000"
                          : "",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                  <div style={{ width: "40%" }}>
                    <Input
                      placeholder={"Work Phone 02"}
                      name={"workPhone2"}
                      onChange={handleInputChange}
                      type={"text"}
                      value={formValues.workPhone2}
                      errorMessage={formErrors.workPhone2}
                      style={{
                        border: formErrors.workPhone2
                          ? "1px solid #FF0000"
                          : "",
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
                  gap: "6px",
                }}
              >
                <Input
                  placeholder={"Enter Number"}
                  name={"mobileNumber"}
                  label={"Mobile Number"}
                  onChange={handleInputChange}
                  type={"number"}
                  value={formValues.mobileNumber}
                  errorMessage={formErrors.mobileNumber}
                  style={{
                    border: formErrors.mobileNumber ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                    height: "27px",
                  }}
                />
              </div>
              {/* <div
                className="divhh"
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <SelectDropDown
                  label={"Currency"}
                  value={formValues?.currency}
                  onChange={handleInputChange}
                  name={"currency"}
                  errorMessage={formErrors.currency}
                  style={{
                    border: formErrors.currency ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                    width: "50%",
                  }}
                >
                  {currency?.length > 0 &&
                    currency.map((currencyList) => (
                      <MenuItem
                        key={currencyList.code}
                        value={currencyList.code}
                      >
                        {currencyList.currency}
                      </MenuItem>
                    ))}
                </SelectDropDown>
              </div> */}
              <div className="tw-relative tw-flex tw-flex-col tw-w-1/2 tw-gap-[1px]">
                <label htmlFor="">Currency</label>
                <div className="relative">
                  <input
                    id="inp-select"
                    autoComplete="off"
                    name={"currency"}
                    value={formAddress.current.currency}
                    onClick={(e) =>
                      handleInputClick("currency__inp", "currency")
                    }
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full ${
                      formErrors.currency
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                    placeholder="Enter Currency"
                    // onChange={handleCurrencyInputChange}
                    onChange={handleFilterCurrency}
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
                  {filteredCurrency.length > 0 && (
                    <ul
                      id="currency__inp"
                      className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                    >
                      {filteredCurrency.map((currency) => {
                        return (
                          <li
                            className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                            key={currency.code}
                            value={currency.code}
                            onClick={() => handleChangeCurrency(currency)}
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
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div style={{ width: "100%" }}>
                  <label htmlFor="">Place of Supply</label>
                </div>
                <div
                  className="input-place"
                  style={{ display: "flex", gap: "3rem" }}
                >
                  <div style={{ width: "40%" }}>
                    {/* <SelectDropDown
                      name={"placeOfSupply"}
                      value={
                        formValues?.placeOfSupply
                          ? formValues.placeOfSupply
                          : ""
                      }
                      onChange={handleInputChange}
                      errorMessage={formErrors?.placeOfSupply}
                      style={{
                        border: formErrors.placeOfSupply
                          ? "1px solid #FF0000"
                          : "",
                        fontSize: "12px",
                      }}
                    >
                      {state?.length > 0 &&
                        state.map((x) => {
                          return <MenuItem value={x?.name}>{x?.name}</MenuItem>;
                        })}
                    </SelectDropDown> */}
                    <div className="relative">
                      <input
                        autoComplete="off"
                        value={formAddress.current.placeOfSupply}
                        placeholder="Place of supply"
                        onClick={() =>
                          handleInputClick("place__of__supply", "placeOfSupply")
                        }
                        onChange={handleFilterPlaceOfSupply}
                        className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                          formErrors.placeOfSupply
                            ? "tw-border tw-border-[#FF0000]"
                            : "tw-border"
                        }`}
                        type="text"
                      />
                      <span className="tw-relative tw-z-0">
                        <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                      </span>
                      <div className="tw-relative">
                        {filteredPlaceOfSupply.length > 0 && (
                          <ul
                            id="place__of__supply"
                            className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-10 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                          >
                            {filteredPlaceOfSupply.map((state) => (
                              <li
                                onClick={() =>
                                  handleChangePlaceOfSupply(state.name)
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
                  <div style={{ width: "40%" }}>
                    <input
                      type="text"
                      style={{
                        border: formErrors.area ? "1px solid #FF0000" : "",
                        fontSize: "12px",
                        height: "27px",
                      }}
                      value={formValues?.area}
                      onChange={handleInputChange}
                      id="input"
                      placeholder="Area"
                      name="area"
                    />
                  </div>
                </div>
              </div>
              <div className="divhh">
                <div className="relative tw-w-3/6">
                  <input
                    id="inp-select"
                    autoComplete="off"
                    value={formAddress.current.billingState}
                    placeholder="State"
                    onClick={() =>
                      handleInputClick("billing__state", "billingState")
                    }
                    onChange={(e) =>
                      handleFiltering(e, "state", "billing", "billing__state")
                    }
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                      formErrors.billingState
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                  />
                  <span className="tw-relative tw-z-0">
                    <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                  </span>
                  <div className="tw-relative">
                    {filteredBillingState.length > 0 && (
                      <ul
                        id="billing__state"
                        className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-10 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                      >
                        {filteredBillingState.map((state) => (
                          <li
                            onClick={() =>
                              handleChangeState(
                                state,
                                "billing",
                                "billing__state"
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

              <div className="divhh">
                <div className="relative tw-w-3/6">
                  <input
                    autoComplete="off"
                    value={formAddress.current.billingCity}
                    placeholder="City"
                    onClick={() =>
                      handleInputClick("billing__city", "billingCity")
                    }
                    onChange={(e) =>
                      handleFiltering(e, "city", "billing", "billing__city")
                    }
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                      formErrors.billingCity
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                  />
                  <span className="tw-relative tw-z-0">
                    <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                  </span>
                  <div className="tw-relative">
                    {filteredBillingCity.length > 0 && (
                      <ul
                        id="billing__city"
                        className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-0 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                      >
                        {filteredBillingCity.map((city) => (
                          <li
                            onClick={() =>
                              handleChangeCity(city, "billing", "billing__city")
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
              </div>
              <div className="label-div">
                <Input
                  placeholder={"Contact Number"}
                  name={"billingContactNumber"}
                  onChange={handleInputChange}
                  type={"number"}
                  value={formValues.billingContactNumber}
                  errorMessage={formErrors.billingContactNumber}
                  style={{
                    border: formErrors.billingContactNumber
                      ? "1px solid #FF0000"
                      : "",
                    fontSize: "12px",
                    height: "30px",
                  }}
                />
              </div>
              <div
                className="label-div"
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div className="relative">
                  <input
                    id="inp-select"
                    autoComplete="off"
                    value={formAddress.current.deliveryState}
                    placeholder="State"
                    onClick={() =>
                      handleInputClick("delivery__state", "deliveryState")
                    }
                    onChange={(e) =>
                      handleFiltering(e, "state", "delivery", "delivery__state")
                    }
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                      formErrors.deliveryState
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                  />
                  <span className="tw-relative tw-z-0">
                    <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                  </span>
                  <div className="tw-relative">
                    {filteredDeliveryState.length > 0 && (
                      <ul
                        id="delivery__state"
                        className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-10 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                      >
                        {filteredDeliveryState.map((state) => (
                          <li
                            onClick={() =>
                              handleChangeState(
                                state,
                                "delivery",
                                "delivery__state"
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
              <div style={{ width: "50%" }}>
                <div className="relative">
                  <input
                    id="inp-select"
                    autoComplete="off"
                    value={formAddress.current.deliveryCity}
                    placeholder="City"
                    onClick={() =>
                      handleInputClick("delivery__city", "deliveryCity")
                    }
                    onChange={(e) =>
                      handleFiltering(e, "city", "delivery", "delivery__city")
                    }
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-w-full tw-z-[100] ${
                      formErrors.deliveryCity
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    type="text"
                  />
                  <span className="tw-relative tw-z-0">
                    <IoIosArrowDown className="tw-absolute tw-top-[6px] tw-left-[-21px] tw-text-[#8153E2] tw-z-40" />
                  </span>
                  <div className="tw-relative">
                    {filteredDeliveryCity.length > 0 && (
                      <ul
                        id="delivery__city"
                        className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-0 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                      >
                        {filteredDeliveryCity.map((city) => (
                          <li
                            onClick={() =>
                              handleChangeCity(
                                city,
                                "delivery",
                                "delivery__city"
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
              </div>
              <div className="label-div">
                <Input
                  placeholder={"Contact Number"}
                  name={"deliveryContactNumber"}
                  onChange={handleInputChange}
                  type={"number"}
                  value={formValues.deliveryContactNumber}
                  errorMessage={formErrors.deliveryContactNumber}
                  style={{
                    border: formErrors.deliveryContactNumber
                      ? "1px solid #FF0000"
                      : "",
                    fontSize: "12px",
                    height: "30px",
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AddAndEditVendor;
