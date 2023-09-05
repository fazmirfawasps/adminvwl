import {
  Button,
  InputLabel,
  MenuItem,
} from "@mui/material";
import React from "react";
import Input from "../Input/Input";
import SelectDropDown from "../SelectDropDown/SelectDropDown";
import * as Yup from "yup";
import TextArea from "../TextArea/TextArea";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import SubNavbar from "../SubNavbar/SubNavbar";
import ModalComponent from "../Modal/ModalComponent";
import Classes from "./AddNewItem.module.css";
import {
  addCategory,
  getAllCategories,
  getAllParentCategories,
  addNewItem,
  fetchAllUnits,
  fetchOneItem,
  addUnit,
  editAllItem,
} from "../../services/ItemService";
import { getAllTax } from "../../services/taxService";
import { taxPreferences, stockStatus } from "../../constants/constants";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
const schema = Yup.object().shape({
  itemName: Yup.string().required("Item Name  is required"),
  sku: Yup.string().required("Sku is required"),
  retailPrice: Yup.string().required("Retail Price is required"),
  purchasePrice: Yup.string().required("Purchase Price is required"),
  description: Yup.string().required("Description is required"),
  taxPreferences: Yup.string().required("Tax Preference is required"),
  category: Yup.string().required("Category is required"),
  discountedPrice: Yup.string().required("Discounted Price  is required"),
  discountedPercentage: Yup.string().required(
    "Discounted Percentage is required"
  ),
  wholesalePrice: Yup.string().required("required"),
  minQuantity: Yup.string().required("required"),
  stockStatus: Yup.string().required("required"),
  stockQuantity: Yup.string().required("required"),
  image: Yup.string().required("required"),
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

const modal1Style = {
  width: 417,
};

const modal2Style = {
  width: 390,
  height: 250,
};

const modal3Style = {
  width: 390,
  height: 380,
}

const initialValues = {
  itemType: "Product",
  itemName: "",
  sku: "",
  primaryUnit: "",
  retailPrice: "",
  purchasePrice: "",
  itemDescription: "",
  taxPreference: "",
  image: null,
  category: "",
  stockStatus: "",
  stockQuantity: "",
  discountedPrice: "",
  discountedPercentage: "",
  wholesalePrice: "",
  minQuantity: "",
  tax: "",
  hsnCode: "",
  primaryUnitQuantity: "",
  secondaryUnit: "",
  quantityPerUnit: "",
  secondaryUnitPrice: "",
  // stockConversion:[]
};



const AddNewItem = () => {
  const folderName = "Items";
  const { id } = useParams();
  const navigate = useNavigate();
  //handling form Erros
  const [formErrors, setFormErrors] = useState({});
  //handle the form values
  const [formValues, setFormValues] = useState(initialValues);
  console.log(formValues, 'formValuesssssssssss');
  const [categoryValues, setCategoryValues] = useState({
    categoryName: "",
    parentCategory: "",
    categoryDescription: "",
  });

  //handling the radio button
  const [itemType, setItemType] = useState("Product");
  //handling the checkbox
  const [checkbox, setCheckBox] = useState(false);

  const [manageStock, setManageStock] = useState(false);

  //handling the selected taxpreference
  const [selectedTaxPreference, setSelectedTaxPreference] = useState("");

  const [selectStockStatus, setSelectedStockStatus] = useState("");

  const [units, setUnits] = useState([]);

  const [selectedUnits, setSelectedUnis] = useState("");

  //handling the Edit unit modal
  const [open, setOpen] = useState(false);

  //handling the category Modal
  const [showModal, setShowModal] = useState(false);

  const [unitModal, setUnitModal] = useState(false);

  //store all  the taxes
  const [taxes, setTaxes] = useState([]);
  // state to store the selected tax value
  const [selectedTax, setSelectedTax] = useState("");

  const [unitLists, setUnitLists] = useState([]);

  const [selectedSecondaryUnit, setSelectedSecondaryUnit] = useState("");

  const [parentCategory, setParentCategory] = useState([]);
  
  const [categories, setCategories] = useState([]);

  const [showPrimary, setShowPrimary] = useState(false);

  const [showSecondary, setShowSecondary] = useState(false);

  const [categoryList, setCategoryList] = useState(false)

  const [unitState, setUnitState] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(null)

  const [selectedPrimaryUnit, setSelectedPrimaryUnit] = useState(null)

  const [image, setImage] = useState({});

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [unitValues, setUnitValues] = useState({
    unitName: '',
    unitType: ''
  })
  // console.log(unitValues, 'unitValue');

  const handleUnitPrice = () => {
    const newValue = {
      numberOfPrimaryUnit: formValues.primaryUnitQuantity,
      secondaryUnit: selectedSecondaryUnit,
      numberOfSecondaryUnit: formValues.quantityPerUnit,
      totalQuantity: Number(formValues.primaryUnitQuantity) * Number(formValues.quantityPerUnit),
      unitPrice: formValues.secondaryUnitPrice
    };
    setUnitLists([...unitLists, newValue]);
    // setFormValues({
    //   ...formValues,
    //   stockConversion: ([...formValues.stockConversion, newValue]),
    // });
  };

  const handleSaveButtonClick = () => {
    handleUnitPrice();
  };

  const handleUnitvalue = (event) => {
    try {
      const { name, value } = event.target;
      setUnitValues({ ...unitValues, [name]: value })
    } catch (error) {
      console.log(error);

    }
  }

  const handleModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleUnitModal = () => setUnitModal(true);
  const handleCloseUnitModal = () => setUnitModal(false);
  const handleImageCancel = () => {
    setFormValues({ ...formValues, image: null, imageKey: Date.now() });
  };
  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    if (name === "primaryUnitQuantity") {
      {
        value ? setShowPrimary(true) : setShowPrimary(false);
      }
    }
    if (name === "secondaryUnitPrice") {
      {
        value ? setShowSecondary(true) : setShowSecondary(false);
      }
    }

    setFormValues({ ...formValues, [name]: value });
    try {
      await Yup.reach(schema, name).validate(value);
      setFormErrors({ ...formErrors, [name]: null });
    } catch (error) {
      setFormErrors({ ...formErrors, [name]: error.message });
    }
  };

  const handleAddCategory = async () => {
    const data = await addCategory(categoryValues);
    if (data.data.message) {
      setShowModal(false);
      setCategoryValues("")
      setCategoryList(!categoryList)
      fetchCategories()
    }

  };

  const handleRadioChange = (event) => {
    console.log(event.target.value,'the value');
    setItemType(event.target.value);
    setFormValues({...formValues,itemType:event.target.value})
  };

  function handleImageChange(event) {
    let previewImage = window.URL.createObjectURL(event.target.files[0]);
    setImage(previewImage);
    setFormValues((prevFormData) => ({
      ...prevFormData,
      image: event.target.files[0],
    }));
  }

  const handleTaxPreferenceChange = (event) => {
    const taxPreference = event.target.value;
    setSelectedTaxPreference(taxPreference);
    setFormValues({ ...formValues, taxPreference: taxPreference })
  };

  const handleParentCategorie = (event) => {
    setCategoryValues({
      ...categoryValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleStockStatus = (event) => {
    const selectedStock = event.target.value;
    setSelectedStockStatus(selectedStock);
    setFormValues({ ...formValues, stockStatus: selectedStock });
  };

  const handleCheckboxChange = () => {
    setCheckBox(!checkbox);
  };

  const handleUnitChange = (event) => {
    const units = event.target.value;
    setSelectedUnis(units);
    setFormValues({ ...formValues, primaryUnit: units });
  };

  const handleTaxChange = (event) => {
    try {
      const newTax = event.target.value;
      setSelectedTax(newTax);
      setFormValues({ ...formValues, tax: newTax });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    const { data } = await getAllCategories();
    setCategories(data);
  };

  const handleSecondaryUnitChange = (event) => {
    try {
      const secondaryUnit = event.target.value;
      setSelectedSecondaryUnit(secondaryUnit);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryState = () => {
    try {
      setCategoryList(!categoryList)
    } catch (error) {
      console.log(error);

    }
  }
  const assignSelectValue = (value, event) => {
    try {
      setSelectedCategory(value)
      const data = JSON.stringify(value)
      setFormValues({ ...formValues, category: data })
      setCategoryList(!categoryList)
    } catch (error) {
      console.log(error);

    }
  }
  const assignUnitValue = (value) => {
    try {
      setSelectedPrimaryUnit(value)
      setFormValues({ ...formValues, primaryUnit: value })
      setUnitState(!unitState)
    } catch (error) {
      console.log(error);

    }
  }

  const handleUniltState = () => {
    try {
      setUnitState(!unitState)
    } catch (error) {
      console.log(error);
    }
  }
  const handleUnit = async () => {
    try {
      const data = await addUnit(unitValues)
      if (data.data.message) {
        setUnitLists(!unitLists)
        // setUnitValues("")
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleSubmit = async () => {
    try {
      // await schema.validate(formValues, { abortEarly: false });
      const formDataObj = new FormData();
      Object.keys(formValues).forEach((key) => {
        formDataObj.append(key, formValues[key]);
      });
      formDataObj.append('stockConversion', JSON.stringify(unitLists))
      if (id) {
        const { data } = await editAllItem(formDataObj, id);
      } else {
        const { data } = await addNewItem(formDataObj);
        navigate("/sales/items");
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
    setItemType("Product");
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getAllParentCategories();
      setParentCategory(data);
    }
    fetchData();
  }, []);

  useEffect(() => {

    fetchCategories();
  }, []);

  useEffect(() => {
    getUnits();
  }, []);

  useEffect(() => {
    const fetchTaxes = async () => {
      const { data } = await getAllTax();
      setTaxes(data);
    };
    fetchTaxes();
  }, []);

  useEffect(() => {
    if (id) {
      const getItemDetails = async (id) => {
        try {
          const { data } = await fetchOneItem(id);
          setFormValues(data);
           const images = `http://localhost:8000/images/${folderName}/${data.image}`;
          setImage(images);
        } catch (error) {
          console.log(error);
        }
      };
      getItemDetails(id);
    }
  }, [id]);

  const getUnits = async () => {
    const { data } = await fetchAllUnits();
    setUnits(data.data);
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

  return (
    <>
      {/* <SubNavbar onClick={handleSubmit} url={'/sales/items'} /> */}
      <div className="tw-relative tw-mt-16 tw-bg-white">
        <SubNavbar
          leftText={"create new Item"}
          buttons={buttons}
          fullBorder={true}
        />
        <div className="add-new-customer-container tw-px-14 tw-py-8 tw-mt-12">
          <div className="left-container-wrapper" style={{height:'78vh'}} >
            <div className="checkbox-content-wrapper">
              <div className="label-div" style={{ width: "100%" }}>
                <label htmlFor="">Type</label>
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
                    className={Classes.item_input}
                    name="option"
                    onChange={handleRadioChange}
                    value="Product"
                    checked={itemType === "Product"}
                  />
                  <div>
                    <label>Product</label>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <input
                    type="radio"
                    name="option"
                    onChange={handleRadioChange}
                    value="Service"
                    checked={itemType === "Service"}
                    style={{ cursor: 'pointer' }}
                  />
                  <label>Service</label>
                </div>
              </div>
            </div>
            <Input
              label={"Name"}
              type={"text"}
              placeholder={"Enter Item Name"}
              name={"itemName"}
              value={formValues.itemName}
              onChange={handleInputChange}
              errorMessage={formErrors.itemName}
              style={{
                border: formErrors.itemName ? "1px solid #FF0000" : "",
                height: "27px",
                fontSize: "12px",
              }}
            />
            <Input
              label={"SKU"}
              type={"number"}
              placeholder={"Enter SKU"}
              name={"sku"}
              onChange={handleInputChange}
              value={formValues.sku}
              errorMessage={formErrors.sku}
              style={{
                border: formErrors.sku ? "1px solid #FF0000" : "",
                fontSize: "12px",
                height: "27px",
              }}
            />
            <div className="relative">
              <Input
                label={"Primary Unit"}
                type={"text"}
                name={"primaryUnit"}
                onChange={handleInputChange}
                value={formValues.primaryUnit.unitType}
                errorMessage={formErrors.sku}
                onClick={handleUniltState}
                style={{
                  border: formErrors.sku ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                  height: "27px",
                  cursor:'pointer'
                }}
              />
              <span className="tw-relative tw-z-0">
                <IoIosArrowDown onClick={handleUniltState} className="tw-absolute tw-top-[-20px] tw-left-[11.5rem] tw-text-[#252429] tw-z-40 tw-cursor-pointer" />
              </span>
              <div className="tw-relative">
                {unitState ? (
                  <ul
                    className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                  >
                    {units?.map((unit) => (
                      <li
                        className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                        onClick={(e) => assignUnitValue(unit, e)}
                      >
                        {unit.unitName}
                        <span>({unit.unitType})</span>
                      </li>
                    ))}
                    <li className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]"
                      onClick={handleUnitModal}
                    >
                      <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add
                      New Units
                    </li>
                  </ul>
                ) : null}
              </div>
            </div>
            <ModalComponent
              title={"New Unit"}
              onClose={handleCloseUnitModal}
              open={unitModal}
              fade={unitModal}
              style={{ ...baseStyle, ...modal2Style }}
            >
              <div>
                <div
                  className="modal-main-div"
                  style={{ display: "flex", paddingTop: "1rem", gap: "2rem" }}
                >
                  <div
                    className="modal-inner-div"
                    style={{ width: "90%", paddingLeft: "27px" }}
                  >
                    <Input
                      type={"text"}
                      label={"Unit Name"}
                      placeholder={"Enter Unit Name"}
                      name={"unitName"}
                      value={categoryValues.unitName}
                      onChange={handleUnitvalue}
                      style={{
                        border: formErrors.categoryName
                          ? "1px solid #FF0000"
                          : "",
                        height: "27px",
                        fontSize: "12px",
                        width: "100%",
                        
                      }}
                    />
                  </div>
                </div>
                <div
                  className="modal-main-div"
                  style={{ display: "flex", paddingTop: "1rem", gap: "2rem" }}
                >
                  <div
                    className="modal-inner-div"
                    style={{ width: "90%", paddingLeft: "27px" }}
                  >
                    <Input
                      type={"text"}
                      label={"Unit Type"}
                      placeholder={"Enter Unit Type"}
                      name={"unitType"}
                      onChange={handleUnitvalue}
                      value={categoryValues.unitType}
                      style={{
                        border: formErrors.categoryName
                          ? "1px solid #FF0000"
                          : "",
                        height: "27px",
                        fontSize: "12px",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "90%",
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingBlock: "1rem",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#8153E2",
                    color: "white",
                    height: "25px",
                  }}
                  onClick={handleUnit}
                >
                  Save
                </Button>
              </div>
            </ModalComponent>
            <div className="compony-address">
              <Input
                label={"Price"}
                placeholder={"Retail Price"}
                name={"retailPrice"}
                value={formValues.retailPrice}
                onChange={handleInputChange}
                type={"number"}
                errorMessage={formErrors.retailPrice}
                style={{
                  border: formErrors.retailPrice ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                  height: "27px",
                }}
              />
            </div>
            <div className="compony-address">
              <Input
                label={"Purchase Price"}
                placeholder={"Purchase  Price"}
                name={"purchasePrice"}
                value={formValues.purchasePrice}
                onChange={handleInputChange}
                type={"number"}
                errorMessage={formErrors.purchasePrice}
                style={{
                  border: formErrors.purchasePrice ? "1px solid #FF0000" : "",
                  fontSize: "12px",
                  height: "27px",
                }}
              />
            </div>
            <div
              className="delivery-address"
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextArea
                  label={"Description"}
                  name={"itemDescription"}
                  placeholder={"Enter Description here"}
                  onChange={handleInputChange}
                  value={formValues.itemDescription}
                  errorMessage={formErrors.description}
                  style={{
                    border: formErrors.description ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                  }}
                />

                {/* <SelectDropDown
                  label={"Tax preference"}
                  value={selectedTaxPreference}
                  onChange={handleTaxPreferenceChange}
                  errorMessage={formErrors.taxPreference}
                  style={{
                    border: formErrors.taxPreference ? "1px solid #FF0000" : "",
                    fontSize: "12px",
                  }}
                >
                  {taxPreferences.map((taxpreference) => (
                    <MenuItem value={taxpreference.value}>
                      {taxpreference.value}
                    </MenuItem>
                  ))}
                </SelectDropDown> */}
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
                gap: "6px",
                position: "relative",
              }}
            >
              <label htmlFor="">Item image</label>
              <Button
                variant="contained"
                component="label"
                style={{
                  background: "white",
                  boxShadow: "none",
                  border: "1.5px dotted #8153E2",
                  width: "50%",
                  height: "32px",
                }}
              >
                Upload
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  name="image"
                  key={formValues.imageKey}
                  placeholder="Upload Item Image"
                  onChange={handleImageChange}
                />
                <InputLabel sx={{fontSize:'12px',textTransform:'capitalize',cursor: 'pointer' }}  htmlFor="upload-input">Upload Item image</InputLabel>
              </Button>
              <div className={Classes.input_right_content_item}>
                {formValues.image ? (
                  <div>
                    <img className={Classes.logo_item} src={image} alt="" />
                    <MdOutlineCancel style={{ position: "absolute", top: '19px', right: "5.1rem", color: "white", cursor: "pointer" }} onClick={handleImageCancel} />
                  </div>
                ) : (
                  <p 
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "10px",
                    }}
                    className={Classes.logo_item}
                  >
                    image
                  </p>
                )}
              </div>
            </div>
            <div
              className="label-div"
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginTop:'-9px'
              }}
            >
              <label htmlFor="">Category</label>
              <div className="relative">
                <input
                  label={"Category"}
                  value={selectedCategory?.name}
                  onChange={handleInputChange}
                  onClick={handleCategoryState}
                  name={"category"}
                  style={{
                    border: formErrors.industry ? "1px solid #FF0000" : "",height:'27px',
                    cursor:'pointer'
                  }}
                />
                <span className="tw-relative tw-z-0">
                  <IoIosArrowDown onClick={handleCategoryState} className="tw-absolute tw-top-[6px] tw-left-[-27px] tw-text-[#252429] tw-z-40 tw-cursor-pointer" />
                </span>

                <div className="tw-relative">
                  {categoryList ? (
                    <ul className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm">
                      {categories?.map((category) => (
                        <React.Fragment key={category._id}>
                          <li
                            className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                            onClick={(e) => assignSelectValue(category, e)}
                          >
                            {category.name}
                          </li>
                          {/* Display subcategories */}
                          {category.subcategories.length > 0 ? (
                            <ul>
                              {category.subcategories.map((sub) => (
                                <li
                                  className="tw-px-8 tw-text-start tw-py-2 tw-cursor-pointer hover:tw-bg-[#8153E2] hover:tw-text-white"
                                  onClick={(e) => assignSelectValue(sub, e)}
                                  key={sub._id}>{sub.name}</li>
                              ))}
                            </ul>
                          ) : null}
                        </React.Fragment>
                      ))}
                      <li
                        className="tw-px-3 tw-text-start tw-py-2 tw-cursor-pointer tw-hover:bg-gray-100 tw-bg-[#EEE7FF]"
                        onClick={handleModal}
                      >
                        <AiOutlinePlus className="tw-inline tw-mb-0.5" /> Add New Category
                      </li>
                    </ul>
                  ) : null}
                </div>

              </div>
              <ModalComponent
                title={"New Category"}
                onClose={handleCloseModal}
                open={showModal}
                fade={showModal}
                style={{ ...baseStyle, ...modal3Style }}
              >
                <div className="tw-px-6 tw-py-3" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} >
                  <div className="tw-w-full">
                    <Input
                      type={"text"}
                      label={"Category Name"}
                      placeholder={"Enter Category Name"}
                      name={"categoryName"}
                      value={categoryValues.categoryName}
                      onChange={handleParentCategorie}
                      errorMessage={formErrors.categoryName}
                      style={{
                        border: formErrors.categoryName
                          ? "1px solid #FF0000"
                          : "",
                        height: "27px",
                        fontSize: "12px",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="tw-w-full" >
                    <label>Parent Category </label>
                    <SelectDropDown
                      value={categoryValues.parentCategory}
                      onChange={handleParentCategorie}
                      errorMessage={formErrors.parentCategorie}
                      name={"parentCategory"}
                      style={{
                        border: formErrors.parentCategorie
                          ? "1px solid #FF0000"
                          : "",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    >
                      <MenuItem value="none">None</MenuItem>
                      {parentCategory?.map((category) => (
                        <MenuItem key={category} value={category?._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </SelectDropDown>
                  </div>
                  <div className="tw-w-full" >
                    <TextArea
                      label={"Description"}
                      name={"categoryDescription"}
                      placeholder={"Enter Description here"}
                      onChange={handleParentCategorie}
                      errorMessage={formErrors.categoryDescription}
                      style={{
                        border: formErrors.categoryDescription
                          ? "1px solid #FF0000"
                          : "",
                        fontSize: "12px",
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
                      onClick={handleAddCategory}
                      className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </ModalComponent>
            </div>
            <div
              className="wrapper"
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div className="label-div" style={{ width: "100%" }}></div>
              <div
                className="input-phone"
                style={{ display: "flex", gap: "3rem",marginTop:'-9px' }}
              >
                <div style={{ width: "40%" }}>
                  <SelectDropDown
                    label={"Stock Status"}
                    onChange={handleStockStatus}
                    value={selectStockStatus}
                    errorMessage={formErrors.taxPreference}
                    style={{
                      border: formErrors.industry ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height:'27px'
                    }}
                  >
                    {stockStatus &&
                      stockStatus.map((stockStatus, index) => (
                        <MenuItem key={index} value={stockStatus.value}>
                          {stockStatus.value}
                        </MenuItem>
                      ))}
                  </SelectDropDown>
                </div>

                <div style={{ width: "40%", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      left: "120px",
                      top: "1px",
                      gap: "0.3rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      style={{
                        width: "15px",
                        height: "15px",
                        cursor: "pointer",
                      }}
                    />
                    <label>Manage Stock</label>
                  </div>
                  <Input
                    label={"Stock Quantity"}
                    placeholder={"Enter Stock Quantity"}
                    name={"stockQuantity"}
                    onChange={handleInputChange}
                    value={formValues.stockQuantity}
                    type={"number"}
                    disabled={!checkbox}
                    errorMessage={formErrors.stockQuantity}
                    style={{
                      border: formErrors.stockQuantity
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
              className="wrapper"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                width: "85%",
              }}
            >
              <label>Stock Convertion</label>
              <div
                className="input-firstname"
                style={{ display: "flex", gap: "3rem", width: "50%" }}
              >
                <div style={{ width: "50%" }}>
                  <div className="div">
                    <Button
                      variant="outlined"
                      style={{
                        color: "#8153E2",
                        border: "1px solid #8153E2",
                        height: "25px",
                        textTransform: "capitalize",
                      }}
                      onClick={handleOpen}
                    >
                      Edit Unit
                    </Button>
                    <ModalComponent
                      title={"Edit Unit"}
                      onClose={handleClose}
                      open={open}
                      fade={open}
                      style={{ ...baseStyle, ...modal1Style }}
                    >
                      <div
                        style={{
                          paddingInline: "33px",
                          width: "100%",
                          paddingBlock: "30px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <label>Primary Unit</label>
                          <div
                            className="modal-main-div"
                            style={{
                              display: "flex",
                              gap: "15px",
                              width: "100%",
                              alignItems: "flex-end",
                            }}
                          >
                            <div
                              className="modal-inner-div"
                              style={{ width: "80%" }}
                            >
                              <SelectDropDown
                                value={selectedUnits}
                                name="primaryUnit"
                                onChange={handleUnitChange}
                                style={{
                                  border: formErrors.industry
                                    ? "1px solid #FF0000"
                                    : "",
                                  fontSize: "12px",
                                  height: "27px",
                                  width: '244px'

                                }}
                              >
                                {units?.map((unit) => (
                                  <MenuItem
                                    value={unit?.unitName}
                                    key={unit?._id}
                                  >
                                    {unit?.unitName}{" "}
                                    <span>({unit?.unitType})</span>{" "}
                                  </MenuItem>
                                ))}
                                <MenuItem value={selectedUnits}>
                                  {selectedUnits}
                                </MenuItem>
                              </SelectDropDown>
                            </div>
                            <div
                              className="modal-input"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Input
                                type={"text"}
                                placeholder={"01"}
                                name={"primaryUnitQuantity"}
                                value={formValues.primaryUnitQuantity}
                                onChange={handleInputChange}
                                errorMessage={formErrors.itemName}
                                style={{
                                  border: formErrors.itemName
                                    ? "1px solid #FF0000"
                                    : "",
                                  height: "27px",
                                  fontSize: "12px",
                                  width: '80px'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label>Secondary Unit</label>
                          <div
                            className="modal-main-div"
                            style={{
                              display: "flex",
                              gap: "15px",
                              width: "100%",
                              alignItems: "flex-end",
                            }}
                          >
                            <div
                              className="modal-inner-div"
                              style={{ width: "80%" }}
                            >
                              <SelectDropDown
                                value={selectedSecondaryUnit}
                                onChange={handleSecondaryUnitChange}
                                style={{
                                  border: formErrors.industry
                                    ? "1px solid #FF0000"
                                    : "",
                                  fontSize: "12px",
                                  height: "27px",
                                  width: '244px'
                                }}
                              >
                                {units?.map((unit) => (
                                  <MenuItem
                                    value={unit?.unitType}
                                    key={unit?._id}
                                  >
                                    {unit?.unitType}{" "}
                                  </MenuItem>
                                ))}
                              </SelectDropDown>
                            </div>
                            <div
                              className="modal-input"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Input
                                type={"text"}
                                placeholder={"01"}
                                name={"quantityPerUnit"}
                                onChange={handleInputChange}
                                value={formValues.quantityPerUnit}
                                errorMessage={formErrors.itemName}
                                style={{
                                  border: formErrors.itemName
                                    ? "1px solid #FF0000"
                                    : "",
                                  height: "27px",
                                  fontSize: "12px",
                                  width: '80px'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="modal-main-div"
                          style={{ display: "flex", gap: "2rem" }}
                        >
                          <div
                            className="modal-inner-div"
                            style={{ width: "100%" }}
                          >
                            <Input
                              type={"text"}
                              label={"Secondary Unit Price"}
                              placeholder={"Enter rate for secodary Unit "}
                              name={"secondaryUnitPrice"}
                              value={formValues.secondaryUnitPrice}
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid #828087",
                                height: "27px",
                                fontSize: "12px",
                                width: "100%",
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className="modal-main-div"
                          style={{
                            display: "flex",
                            gap: "2rem",
                            justifyContent: "space-between",
                          }}
                        >
                          {showPrimary ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "7px",
                                }}
                              >

                                <div >
                                  {unitLists.map((unit, index) => (
                                    <>
                                      <div key={index}
                                        style={{
                                          fontSize: "12px",
                                          color: "#8153E2",
                                        }}
                                      >
                                        {unit.primaryUnitQuantity}{" "}
                                        {unit.selectedSecondaryUnit} ={" "}
                                        {unit.quantityPerUnit}{" "}
                                      </div>
                                      {/* <input
                                  type="radio"
                                  className={Classes.item_input}
                                  name="option"
                                  onChange={handleRadioChange}
                                  value="product"
                                  checked={selectRadio === "product"}
                                  /> */}
                                    </>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : null}
                          {showSecondary ? (
                            <>
                              {/* < div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}  >
                                <input type="radio" className={Classes.item_input}
                                  name='option'
                                  onChange={handleRadioChange}
                                  value='product'
                                />
                                <p style={{ fontSize: '12px', color: '#8153E2' }}>  Unit Price :  {formValues.secondaryUnitPrice} </p>
                              </div> */}
                            </>
                          ) : null}
                          <div className="modal-input" style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }} >
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: "#8153E2",
                                color: "white",
                                height: "25px",
                              }}
                              onClick={handleSaveButtonClick}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ModalComponent>
                  </div>
                </div>
                <div style={{ width: "50%" }}>
                  <p style={{ fontSize: "12px", color: "#8153E2" }}>
                    {formValues.primaryUnitQuantity} {selectedSecondaryUnit} ={" "}
                    {formValues.quantityPerUnit}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="wrapper"
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label>Selling Price</label>
              <div
                className="input-firstname"
                style={{ display: "flex", gap: "3rem", width: "100%" }}
              >
                <div style={{ width: "40%" }}>
                  <Input
                    placeholder={"Discounted Price"}
                    name={"discountedPrice"}
                    onChange={handleInputChange}
                    type={"number"}
                    // errorMessage={formErrors.discountedPrice}
                    style={{
                      border: formErrors.discountedPrice
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
                <div style={{ width: "40%" }}>
                  <Input
                    placeholder={"Discounted Percentage"}
                    name={"discountedPercentage"}
                    onChange={handleInputChange}
                    type={"number"}
                    // errorMessage={formErrors.discountedPercentage}
                    style={{
                      border: formErrors.discountedPercentage
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
              className="wrapper"
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div
                className="input-firstname"
                style={{ display: "flex", gap: "3rem", width: "100%" }}
              >
                <div style={{ width: "40%" }}>
                  <Input
                    label={"Wholesale Price"}
                    placeholder={"Wholesale Price"}
                    name={"wholesalePrice"}
                    onChange={handleInputChange}
                    type={"number"}
                    // errorMessage={formErrors.wholesalePrice}
                    style={{
                      border: formErrors.wholesalePrice
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
                <div style={{ width: "40%" }}>
                  <Input
                    label={"Min Quantity for Wholesale"}
                    placeholder={"Enter Min Wholesale Quantity"}
                    name={"minQuantity"}
                    onChange={handleInputChange}
                    type={"number"}
                    errorMessage={formErrors.minQuantity}
                    style={{
                      border: formErrors.minQuantity ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* {selectedTaxPreference === "Taxable" && (
              <div
                className="wrapper"
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  className="input-firstname"
                  style={{ display: "flex", gap: "3rem", width: "100%" }}
                >
                  <div style={{ width: "40%" }}>
                    <SelectDropDown
                      label={"Select Tax"}
                      value={selectedTax}
                      onChange={handleTaxChange}
                      style={{
                        border: formErrors.industry ? "1px solid #FF0000" : "",
                        fontSize: "12px",
                      }}
                    >
                      {taxes.map((taxes) => (
                        <MenuItem value={taxes._id}>
                          {taxes.taxName}
                        </MenuItem>
                      ))}
                    </SelectDropDown>
                  </div>
                  <div style={{ width: "40%" }}>
                    <Input
                      label={"HSN Code "}
                      placeholder={"Enter HSN Code"}
                      name={"hsnCode"}
                      onChange={handleInputChange}
                      type={"number"}
                      // errorMessage={formErrors.minQuantity}
                      style={{
                        border: formErrors.minQuantity
                          ? "1px solid #FF0000"
                          : "",
                        fontSize: "12px",
                        height: "27px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
        <div className="tax-preference-container tw-px-14 tw-py-8 tw-w-full" style={{display:'flex',}} >
        <div style={{width:'40%',paddingRight:'25px'}}>

            <SelectDropDown
              label={"Tax preference"}
              value={selectedTaxPreference}
              onChange={handleTaxPreferenceChange}
              errorMessage={formErrors.taxPreference}
              style={{
                border: formErrors.taxPreference ? "1px solid #FF0000" : "",
                fontSize: "12px",
                height:'27px'
              }}
            >
              {taxPreferences.map((taxpreference) => (
                <MenuItem value={taxpreference.value}>
                  {taxpreference.value}
                </MenuItem>
              ))}
            </SelectDropDown>
          </div>
          {selectedTaxPreference === "Taxable" && (
            <div
              className="wrapper"
              style={{ display: "flex", flexDirection: "column", gap: "6px", width: '60%', padding:'0px 0px 11px 25px' }}
            >
              <div
                className="input-firstname"
                style={{ display: "flex", gap: "3rem", width: "100%" }}
              >
                <div style={{ width: "40%" }}>
                  <SelectDropDown
                    label={"Select Tax"}
                    value={selectedTax}
                    onChange={handleTaxChange}
                    style={{
                      border: formErrors.industry ? "1px solid #FF0000" : "",
                      fontSize: "12px",
                      height:'27px'
                    }}
                  >
                    {taxes.map((taxes) => (
                      <MenuItem value={taxes._id}>
                        {taxes.taxName}
                      </MenuItem>
                    ))}
                  </SelectDropDown>
                </div>
                <div style={{ width: "40%" }}>
                  <Input
                    label={"HSN Code "}
                    placeholder={"Enter HSN Code"}
                    name={"hsnCode"}
                    onChange={handleInputChange}
                    type={"number"}
                    // errorMessage={formErrors.minQuantity}
                    style={{
                      border: formErrors.minQuantity
                        ? "1px solid #FF0000"
                        : "",
                      fontSize: "12px",
                      height: "27px",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddNewItem;
