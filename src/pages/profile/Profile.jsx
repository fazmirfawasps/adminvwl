import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Country, State, City } from "country-state-city";
import "./profile.css";
import {
  addNewCompany,
  editProfile,
  getProfile,
} from "../../services/profileService";
import Input from "../../components/Input/Input";
import SelectDropDown from "../../components/SelectDropDown/SelectDropDown";
import * as Yup from "yup";
import TextArea from "../../components/TextArea/TextArea";
import SubNavbar from "../../components/SubNavbar/SubNavbar";
import { useNavigate } from "react-router-dom";
import {
  industries,
  dateFormats,
  financialYears,
} from "../../constants/constants";
import { useDispatch } from "react-redux";
import { setCountryCode } from "../../redux/ducks/countrySlice";
import { BiRupee } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@mui/material";
import { MdOutlineCancel } from "react-icons/md";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
      "Invalid email address format"
    ),
  postalCode: Yup.string()
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
  companyAddress: Yup.string()
    .required("address is required")
    .min(3, "Company Address must be at least 3 characters"),
  companyName: Yup.string()
    .required("company Name is required")
    .min(3, "Company Name must be at least 3 characters"),
  bankAccountDetails: Yup.string()
    .required("Bank Account Details is required")
    .min(6, "Invalid Bank Account"),
  website: Yup.string().required("required"),
  country: Yup.string().required("required"),
  state: Yup.string().required("required"),
  city: Yup.string().required("required"),
  industry: Yup.string().required("required"),
  financialYear: Yup.string().required("required"),
  dateFormat: Yup.string().required("required"),
});
const initialState = {
  companyName: "",
  industry: "automation",
  companyAddress: "",
  postalCode: "",
  phoneNumber: "",
  email: "",
  bankAccountDetails: "",
  image: "",
  country: "",
  city: "",
  state: "",
  mobileNumber: "",
  website: "",
  financialYear: "apr-mar",
  dateFormat: dateFormats[1].value,
  _id: null,
};
const folderName = "Items";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //storing formData
  const [formData, setFormData] = useState(initialState);
  //this state is used to store the countries
  const [countries, setCountries] = useState([]);

  //when user selects one countrie it will set to this state
  const [selectedCountry, setSelectedCountry] = useState("");
  //selecting the states
  const [selectState, setSelectState] = useState("");
  // console.log(selectState, 'selcted');
  // store all the states
  const [states, setStates] = useState([]);
  // console.log(states,'states');

  const [cities, setCityName] = useState([]);
  const [filterdCity, setFilteredCity] = useState(cities);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("automation");
  const [image, setImage] = useState({});
  const [filteredState, setFilteredState] = useState([]);
  //storing the dateFormates
  const [selectedFormat, setSelectedFormat] = useState(dateFormats[1].value);

  //for the financial Years
  const [selectefinancialYears, setSelectedfinancialYears] =
    useState("apr-mar");

  const [formErrors, setFormErrors] = useState({});

  const [countryState, setCountryState] = useState(false);
  const [stateState, setStateState] = useState(false);
  const [cityState, setCityState] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [filteredCountries, setFilteredCountries] = useState(countries);

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleCountryChange = (event) => {
    const userInput = event.target.value;
    setSelectedCountry(userInput);
    const filteredList = countries.filter((country) =>
      country.name.toLowerCase().includes(userInput.toLowerCase())
    );
    setSelectedCountry(filteredList.isoCode);
    setFilteredCountries(filteredList);
  };

  const handleImageCancel = () => {
    setFormData({ ...formData, image: null, imageKey: Date.now() });
  };

  const handleIndustryChange = (event) => {
    const industry = event.target.value;
    setSelectedIndustry(industry);
    setFormData({ ...formData, industry: industry });
  };
  const handleFinancialYearChange = (event) => {
    const financialYear = event.target.value;
    setSelectedfinancialYears(financialYear);
    setFormData({ ...formData, financialYear: financialYear });
  };

  function handleImageChange(event) {
    setSelectedImage(event.target.files[0]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: event.target.files[0],
    }));
  }
  function handleFormatChange(event) {
    const dateFormat = event.target.value;
    setSelectedFormat(dateFormat);
    setFormData({ ...formData, dateFormat: dateFormat });
  }

  const assignSelectValue = (value) => {
    try {
      if (selectState || selectedCity) {
        setSelectState("");
        setSelectedCity("");
        setCityName("");
        setFilteredState("");
      }
      let countryId = value.isoCode;
      setSelectedCountryId(countryId);
      dispatch(setCountryCode(countryId));
      localStorage.setItem("selectedCountryId", countryId);
      const states = State.getStatesOfCountry(countryId);
      setSelectedCountry(value.name);
      let stringifiedCountry = JSON.stringify(value);
      setFormData({ ...formData, country: stringifiedCountry });
      setStates(states);
      setFilteredState(states);
      setCountryState(!countryState);
    } catch (error) {
      console.log(error);
    }
  };
  const handleStateList = (value, setValue, selectedState) => {
    setValue(!value);
  };
  const handleStates = (state, setState) => {
    try {
      setState(!state);
    } catch (error) {
      console.log(error);
    }
  };

  const handleListValue = (
    value,
    setValue,
    listState,
    cityState,
    formDataValue
  ) => {
    try {
      if (selectedCity) {
        setSelectedCity("");
      }
      setValue(value.name);
      if (cityState) {
        const cities = City.getCitiesOfState(selectedCountryId, value.isoCode);
        cityState(cities);
      }
      let stringifiedData = JSON.stringify(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [formDataValue]: stringifiedData,
      }));
      listState((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStateChange = (event) => {
    try {
      const userInput = event.target.value;
      if (selectState) {
        setSelectedCity("");
      }
      setSelectState(userInput);
      const filterList = states.filter((state) =>
        state.name.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredState(filterList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCityChange = (event) => {
    try {
      const { value } = event.target;
      setSelectedCity(value);
      const filterList = cities.filter((option) => {
        const { name } = option;
        return name.toLowerCase().includes(value.toLowerCase());
      });
      console.log(filterList, "the list");
      setFilteredCity(filterList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      // await schema.validate(formData, { abortEarly: false });
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });
      if (formData._id) {
        formDataObj.append("selectedImage", selectedImage);
        const object = Object.fromEntries(formDataObj.entries());
        const { data } = await editProfile(object, formData._id);
      } else {
        const { data } = await addNewCompany(formDataObj);
      }
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((innerError) => {
        validationErrors[innerError.path] = innerError.message;
      });
      setFormErrors(validationErrors);
    }
  };

  const fetchProfile = async () => {
    const { data } = await getProfile();
    setSelectedCountry(data.country);
    dispatch(setCountryCode(data.countryCode));
    setSelectedCountryId(data.countryCode);
    localStorage.setItem("selectedCountryId", data.countryCode);
    const states = State.getStatesOfCountry(data.countryCode);
    setStates(states);
    setFilteredState(states);
    const citieName = City.getCitiesOfState(data.countryCode, data.stateCode);
    setCityName(citieName);
    setFilteredCity(citieName);
    setSelectState(data.state);
    setSelectedCity(data.city);
    const images = `http://localhost:8000/images/${folderName}/${data.image}`;
    setImage(images);
    setSelectedfinancialYears(data.financialYear);
    setSelectedFormat(data.dateFormat);
    setSelectedIndustry(data.industry);
    setFormData(data);
  };

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountries(countries);
    setFilteredCountries(countries);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const storedCountryCode = localStorage.getItem("selectedCountryCode");
    if (storedCountryCode && storedCountryCode !== selectedCountry) {
      // Dispatch the stored country code to the Redux store
      dispatch(setCountryCode(storedCountryCode));
    }
  }, [dispatch, selectedCountry]);

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
      {/* <SubNavbar onClick={handleSubmit} /> */}
      <div className="tw-relative tw-mt-16 tw-bg-white">
        <SubNavbar
          leftText={"Profile Settings"}
          buttons={buttons}
          fullBorder={true}
        />
        <div className="profile tw-px-14 tw-py-8 tw-mt-12">
          <div className="profileContainer">
            <div className="input-area">
              <div className="input-left-content">
                <Input
                  label={"Company Name"}
                  type={"text"}
                  placeholder={"Enter Company Name"}
                  name={"companyName"}
                  onChange={handleInputChange}
                  value={formData.companyName}
                  // errorMessage={formErrors.companyName}
                  style={{
                    fontSize: "12px",
                    height: "27px",
                  }}
                />
                <SelectDropDown
                  label={"Industry"}
                  value={selectedIndustry}
                  selectLabel={"industry"}
                  onChange={handleIndustryChange}
                  // errorMessage={formErrors.industry}
                  style={{
                    // border: formErrors.industry ? '1px solid #FF0000' : '',
                    fontSize: "12px",
                    height: "27px",
                  }}
                >
                  {industries.map((industries) => (
                    <MenuItem value={industries.industry}>
                      {industries.industry}
                    </MenuItem>
                  ))}
                </SelectDropDown>
                <TextArea
                  name={"companyAddress"}
                  placeholder={"Address"}
                  onChange={handleInputChange}
                  value={formData.companyAddress}
                  // errorMessage={formErrors.companyAddress}
                  style={{
                    fontSize: "12px",
                    height: "73px",
                  }}
                />
                <Input
                  placeholder={"Zip/Postal Code"}
                  name={"postalCode"}
                  onChange={handleInputChange}
                  type={"number"}
                  value={formData.postalCode}
                  // errorMessage={formErrors.postalCode}
                  style={{
                    // border: formErrors.postalCode ? '1px solid #FF0000' : '',
                    fontSize: "12px",
                    height: "30px",
                  }}
                />
                <Input
                  label={"Phone"}
                  type={"number"}
                  placeholder={"Enter Phone Number"}
                  name={"phoneNumber"}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  // errorMessage={formErrors.phone}
                  style={{
                    // border: formErrors.phone ? '1px solid #FF0000' : '',
                    fontSize: "12px",
                    height: "27px",
                  }}
                />
                <Input
                  label={"Email"}
                  type={"email"}
                  placeholder={"Email"}
                  name={"email"}
                  value={formData.email}
                  onChange={handleInputChange}
                  // errorMessage={formErrors.email}
                  style={{
                    //  border: formErrors.email ? '1px solid #FF0000' : '',
                    fontSize: "12px",
                    height: "27px",
                  }}
                />
                <TextArea
                  label={"Bank Account Details"}
                  name={"bankAccountDetails"}
                  placeholder={"Enter Your bank detail"}
                  onChange={handleInputChange}
                  value={formData.bankAccountDetails}
                  // errorMessage={formErrors.bankAccountDetails}
                  style={{ fontSize: "12px", height: "102px" }}
                />
              </div>
              <div class="input-center-content">
                <div class="tw-flex tw-flex-col tw-gap-1 tw-mt-[-13px]">
                  <label htmlFor="">Company Logo</label>
                  <Button
                    fullWidth
                    variant="contained"
                    component="label"
                    style={{
                      background: "white",
                      boxShadow: "none",
                      border: "0.3px dashed #8153E2",
                      height: "32px",
                    }}
                  >
                    Upload
                    <Input
                      type={"file"}
                      name={"image"}
                      key={formData.imageKey}
                      onChange={handleImageChange}
                      hidden={true}
                      accept={"image/*"}
                    />
                  </Button>
                </div>
                <div className="Customer_input tw-pb-4">
                  <label>Business Location</label>
                  <div className="relative">
                    <input
                      id="inp-select"
                      autoComplete="off"
                      name={"customer"}
                      onClick={() =>
                        handleStates(countryState, setCountryState)
                      }
                      className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                        formErrors.customer
                          ? "tw-border tw-border-[#FF0000]"
                          : "tw-border"
                      }`}
                      type="text"
                      style={{ cursor: "pointer" }}
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e)}
                    />
                    <span className="tw-relative tw-z-0">
                      <BiRupee className="tw-absolute tw-top-[-1px] tw-left-[-40px] tw-text-white tw-rounded-r tw-p-1.5 tw-w-10 tw-h-[27px] tw-bg-[#8153E2] tw-z-40" />
                    </span>
                    <span className="tw-relative tw-z-0">
                      <IoIosArrowDown
                        onClick={() =>
                          handleStates(countryState, setCountryState)
                        }
                        className="tw-absolute tw-top-[6px] tw-left-[-66px] tw-text-[#828087] tw-z-40"
                      />
                    </span>
                    <div className="tw-relative">
                      {countryState ? (
                        <ul
                          id="inp-select-list"
                          className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                        >
                          {filteredCountries?.map((country) => (
                            <li
                              className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                              onClick={(e) => assignSelectValue(country)}
                            >
                              {country.name}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="tw-flex tw-flex-col tw-gap-[11px] tw-mt-[-19px] ">
                  <div className="Customer_input tw-pb-4">
                    <div className="relative">
                      <input
                        autoComplete="off"
                        name={"state"}
                        onClick={() =>
                          handleStateList(stateState, setStateState)
                        }
                        className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                          formErrors.customer
                            ? "tw-border tw-border-[#FF0000]"
                            : "tw-border"
                        }`}
                        type="text"
                        style={{ cursor: "pointer" }}
                        value={selectState ? selectState : ""}
                        onChange={(e) => handleStateChange(e)}
                      />
                      <span className="tw-relative tw-z-0">
                        <IoIosArrowDown
                          onClick={() =>
                            handleStateList(
                              stateState,
                              setStateState,
                              setSelectState
                            )
                          }
                          className="tw-absolute tw-top-[6px] tw-left-[-28px] tw-text-[#828087] tw-z-40"
                        />
                      </span>
                      <div className="tw-relative">
                        {stateState ? (
                          <ul
                            id="inp-select-list"
                            className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                          >
                            {filteredState &&
                              filteredState?.map((state) => (
                                <li
                                  className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                  onClick={(e) =>
                                    handleListValue(
                                      state,
                                      setSelectState,
                                      setStateState,
                                      setCityName,
                                      "state"
                                    )
                                  }
                                >
                                  {state.name}
                                </li>
                              ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="Customer_input ">
                    <div className="relative">
                      <input
                        autoComplete="off"
                        name={"city"}
                        onClick={() => handleStateList(cityState, setCityState)}
                        className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                          formErrors.customer
                            ? "tw-border tw-border-[#FF0000]"
                            : "tw-border"
                        }`}
                        type="text"
                        style={{ cursor: "pointer" }}
                        value={selectedCity ? selectedCity : ""}
                        onChange={(e) => handleCityChange(e)}
                      />
                      <span className="tw-relative tw-z-0">
                        <IoIosArrowDown
                          onClick={() =>
                            handleStateList(
                              cityState,
                              setCityState,
                              setSelectedCity
                            )
                          }
                          className="tw-absolute tw-top-[6px] tw-left-[-28px] tw-text-[#828087] tw-z-40"
                        />
                      </span>
                      <div className="tw-relative">
                        {cityState ? (
                          <ul
                            id="inp-select-list"
                            className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                          >
                            {filterdCity &&
                              filterdCity?.map((citie) => (
                                <li
                                  className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                  onClick={(e) =>
                                    handleListValue(
                                      citie,
                                      setSelectedCity,
                                      setCityState,
                                      setCityName,
                                      "city"
                                    )
                                  }
                                >
                                  {citie.name}
                                </li>
                              ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "2.225rem" }}>
                  <Input
                    label={"Mobile"}
                    type={"number"}
                    placeholder={"Enter Mobile Number"}
                    name={"mobileNumber"}
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    style={{ fontSize: "12px", height: "27px" }}
                  />
                </div>
                <Input
                  label={"website"}
                  type={"text"}
                  placeholder={"Enter Website"}
                  name={"website"}
                  value={formData.website}
                  onChange={handleInputChange}
                  // errorMessage={formErrors.websiite}
                  style={{ fontSize: "12px", height: "27px" }}
                />
                <div className="tw-flex tw-flex-col tw-gap-[22px]">
                  <SelectDropDown
                    label={"Financial Year"}
                    name={"financialYear"}
                    selectLabel={"financialYear"}
                    onChange={handleFinancialYearChange}
                    value={selectefinancialYears}
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                      formErrors.customer
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    // errorMessage={formErrors.financialYear}
                    style={{ fontSize: "12px", height: "27px" }}
                  >
                    {financialYears.map((year) => (
                      <MenuItem key={year.value} value={year.value}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </SelectDropDown>

                  <SelectDropDown
                    label={"Date Format"}
                    name={"dateFormat"}
                    selectLabel={"dateFormat"}
                    onChange={handleFormatChange}
                    value={selectedFormat}
                    className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] ${
                      formErrors.customer
                        ? "tw-border tw-border-[#FF0000]"
                        : "tw-border"
                    }`}
                    style={{ fontSize: "12px", height: "27px" }}
                  >
                    {dateFormats.map((format) => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.label} {format.example}{" "}
                      </MenuItem>
                    ))}
                  </SelectDropDown>
                </div>
              </div>
              <div className="input-right-content">
                {formData.image ? (
                  <>
                    <img className="image-logo" src={image} />
                    <MdOutlineCancel
                      onClick={handleImageCancel}
                      style={{
                        position: "relative",
                        left: "75px",
                        top: "-91px",
                        cursor: "pointer",
                      }}
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
                    className="image-logo"
                  >
                    image
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
