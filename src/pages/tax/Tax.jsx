import React, { useEffect } from "react";
import SubNavbar from "../../components/SubNavbar/SubNavbar";
import Input from "../../components/Input/Input";
import { Button } from "@mui/material";
import { useState } from "react";
import ModalComponent from "../../components/Modal/ModalComponent";
import {
  addGroup,
  addTax,
  deleteAllTaxes,
  deleteTax,
  getAllGroupedTax,
  getAllTax,
} from "../../services/taxService";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import Table from "../../components/Table/Table";
import { IoIosArrowDown } from "react-icons/io";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";

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
  width: 403,
  height: 423,
};
const modal2Style = {
  width: 403,
  height: 347,
};

const modal3Style = {
  width: 400,
  height: 420,
};

const initialValues = {
  gstNumber: "",
};

const newTaxInitialState = {
  taxName: "",
  taxType: "",
  rate: "",
};

const groupInitialState = {
  groupName: "",
  childTaxes: [],
};

const Tax = () => {
  const taxRateColumns = [
    {
      field: "taxName",
      headerName: "Tax Name",
      width: 120,
      renderCell: (params) => <span>{params?.row?.taxName}</span>,
    },
    {
      field: "taxType",
      headerName: "Tax Type",
      width: 120,
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 120,
    },
  ];
  const groupHeadColumns = [
    {
      field: "groupName",
      headerName: "Group Name",
      width: 160,
      renderCell: (params) => <span>{params?.row?.groupName}</span>,
    },
    {
      field: "taxNames",
      headerName: "Tax Names",
      width: 160,
    },
  ];
  const newGroupColumns = [
    {
      field: "taxName",
      headerName: "Tax Name",
      width: 120,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 120,
    },
  ];

  const navigate = useNavigate();
  const [taxForm, setFormTax] = useState(newTaxInitialState);
  const [groupForm, setGroupForm] = useState(groupInitialState);
  const [groupedTaxes, setGroupedTaxes] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  // console.log(selectedRow,'rowwwww');
  const [taxes, setTaxes] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  //state for delete
  const [deleteModalState, setDeleteModalState] = useState(false)
  const [newTax, setNewTax] = useState(false);
  console.log(newTax, 'new taxxxxxxxxxxxxxxxxxxx');
  const [group, setGroup] = useState(false);
  const [countryState, setCountryState] = useState(false)
  const [values, setValues] = useState(initialValues);
  //when user selects one countrie it will set to this state
  const [selectedCountry, setSelectedCountry] = useState("");
  // store all the states
  const [states, setStates] = useState([]);
  //this state is used to store the countries
  const [countries, setCountries] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const handleOpennewTax = () => setNewTax(true);
  const handleOpennewTax = () => {
    console.log('it shere');
  }
  const handleClosenewTax = () => setNewTax(false);
  const handleOpenGroup = () => setGroup(true);
  const handleCloseGroup = () => setGroup(false);
  const handleGstNumber = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handletaxChange = (event) => {
    const { name, value } = event.target;
    setFormTax({ ...taxForm, [name]: value });
  };

  const handleAddTax = async () => {
    const { data } = await addTax(taxForm);
    handleClosenewTax();
    fetchTaxes();
  };
  const handleInputClick = () => {
    try {
      setCountryState(!countryState)
    } catch (error) {
      console.log(error);

    }
  }
  const handleCountryChange = (event) => {
    const countryId = event.target.value;
    // Add countryId to local storage
    localStorage.setItem("selectedCountryId", countryId);
    const states = State.getStatesOfCountry(countryId);
    setSelectedCountry(countryId);
    setStates(states);
  };
  const handleGroupNameChange = (event, taxId) => {
    const { name, value, type, checked } = event.target;
    const updatedTaxIds = checked ? [...groupForm.childTaxes, taxId]
      : groupForm.childTaxes.filter((id) => id !== taxId);

    setGroupForm({
      ...groupForm,
      childTaxes: updatedTaxIds,
    });
  };
  const handleGroupInput = (event) => {
    try {
      const { name, value } = event.target
      setGroupForm({
        ...groupForm,
        [name]: value,
      });

    } catch (error) {
      console.log(error);

    }
  }

  const assignSelectValue = (value) => {
    try {
      setSelectedCountry(value.name)
      setCountryState(!countryState)
    } catch (error) {
      console.log(error);

    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      let data;
      data = await deleteTax(selectedRow)
      setDeleteModalState(false);
      setLoading(false);
    } catch (error) {
      console.log(error);

    }
  }

  const handleClick = (e) => {
    setSelectedRow(e)
  }

  const fetchGroupedTax = async () => {
    try {
      const { data } = await getAllGroupedTax();
      setGroupedTaxes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewGroup = async () => {
    try {
      const { data } = await addGroup(groupForm);
      handleCloseGroup();
      fetchGroupedTax();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTaxes = async (id) => {
    const { data } = await getAllTax(id);
    setTaxes(data);
  };
  const handleRowClick = (e) => {
    console.log(e, 'eventrowclick');
  }
  const handleDashboardNavigation = (e) => {
    setGroupForm({ ...groupForm, childTaxes: e?.id })
  }

  // useEffect(() => {
  //   fetchTaxes(storedId);
  // }, []);

  useEffect(() => {
    fetchGroupedTax();
  }, []);

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountries(countries);
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('selectedCountryId')
    if(storedId){
      fetchTaxes(storedId)
    }
    const selectedCountry = Country.getCountryByCode(storedId);
    setSelectedCountry(selectedCountry?.name)
    const countries = Country.getAllCountries();
  }, [])
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
      buttonFunction: null,
    },
  ];

  return (
    <>
      <div className="tw-relative tw-mt-16 tw-bg-white">
        <SubNavbar
          leftText={"Tax Settings"}
          buttons={buttons}
          fullBorder={true}
        />
        <div
          className="tw-px-14 tw-pt-8 tw-mt-12"
          style={{
            background: "white",
            width: "100%",
            height: "13vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="Customer_input">
            <label>Business Location</label>
            <div className="relative">
              <input
                id="inp-select"
                autoComplete="off"
                name={"customer"}
                onClick={() => handleInputClick()}
                className={`tw-rounded tw-px-3 tw-h-[27px] tw-text-[12px] tw-mt-[6px] tw-w-full tw-z-[100] 
                // ? "tw-border tw-border-[#FF0000]"
                // : "tw-border"
                }`}
                type="text"
                style={{ cursor: 'pointer', height: '27px', width: '238px' }}
                value={selectedCountry}
              // onChange={(e) => handleCountryChange(e)}
              />
              <span className="tw-relative tw-z-0">
                <IoIosArrowDown
                  onClick={() => handleInputClick()}
                  className="tw-absolute tw-top-[3px] tw-left-[-25px] tw-text-[#828087] tw-z-40"
                />
              </span>
              <div className="tw-relative">
                {countryState ? (
                  <ul
                    id="inp-select-list"
                    className="tw-absolute tw-w-full tw-top-0.5 tw-bg-white tw-z-50 tw-shadow-lg tw-rounded-md tw-overflow-y-auto tw-max-h-48 tw-text-sm"
                  >
                    {countries.map((country) => (
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
          <Input
            type={"text"}
            name={"businessLocation"}
            label={"Business Name"}
            placeholder={"KXENCE ERP PRIVATE LIMITED"}
            style={{
              width: "280px",
              height: "27px",
              fontSize: "12px",
            }}
          />
          <Input
            type={"text"}
            name={"businessLocation"}
            label={"GST Number"}
            placeholder={"32AAJCK1900H1ZZ"}
            style={{
              fontSize: "12px",
              height: "32px",
            }}
          />
          <div>
            <label htmlFor="">Gst settings</label>
            <button
              className="tw-px-3 tw-mt-1.5 tw-h-7 tw-w-[136px] tw-mr-5 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              onClick={handleOpen}
            >
              Edit GST
            </button>
            <ModalComponent
              title={"GST Settings"}
              onClose={handleClose}
              open={open}
              fade={open}
              style={{ ...baseStyle, ...modal1Style }}
            >
              <div
                className="tw-px-6 tw-py-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div className="tw-w-11/12">
                  <Input
                    type={"text"}
                    label={"GSTIN"}
                    placeholder={"Enter GST Number"}
                    name={"gstNumber"}
                    style={{
                      border: "1px solid #828087",
                      height: "27px",
                      fontSize: "12px",
                      width: "100%",
                    }}
                    onChange={handleGstNumber}
                  />
                </div>

                <h6
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    width: "90%",
                    justifyContent: "flex-end",
                    color: "blueviolet",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Get Tax Payer details
                </h6>
                <div className="tw-w-11/12">
                  <Input
                    type={"text"}
                    label={"Business Legal Name "}
                    placeholder={"Business Legal Name "}
                    name={"categoryName"}
                    style={{
                      border: "1px solid #828087",
                      height: "27px",
                      fontSize: "12px",
                      width: "100%",
                    }}
                  />
                </div>

                <div className="tw-w-11/12">
                  <Input
                    type={"text"}
                    label={"Business Trade Name "}
                    placeholder={"Business Trade Name "}
                    name={"categoryName"}
                    style={{
                      border: "1px solid #828087",
                      height: "27px",
                      fontSize: "12px",
                    }}
                  />
                </div>

                <div className="tw-w-11/12">
                  <Input
                    type={"text"}
                    label={"GST registred on"}
                    placeholder={"dd/MM/yyyy"}
                    name={"categoryName"}
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
                >
                  Save
                </Button>
              </div>
            </ModalComponent>
          </div>
        </div>

        <div
          className="tax-wrapper tw-px-14 tw-pt-11"
          style={{
            display: "flex",
            backgroundColor: "white",
            gap: "44px",
          }}
        >
          <div
            className="tax-wrappper-left"
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p>Tax Rates</p>
            <button
              className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              onClick={handleOpennewTax}
            >
              {" "}
              + New Tax
            </button>
          </div>
          <ModalComponent
            title={"Add New Tax"}
            onClose={handleClosenewTax}
            open={newTax}
            fade={newTax}
            style={{ ...baseStyle, ...modal2Style }}
          >
            <div
              className="tw-px-6 tw-py-3"
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div className="tw-w-11/12">
                <Input
                  type={"text"}
                  label={"Tax Name"}
                  placeholder={"Enter Tax Name"}
                  name={"taxName"}
                  onChange={handletaxChange}
                  style={{
                    border: "1px solid #828087",
                    height: "27px",
                    fontSize: "12px",
                    width: "100%",
                  }}
                />
              </div>
              <div className="tw-w-11/12">
                <Input
                  type={"text"}
                  label={"Tax Type"}
                  placeholder={"Enter tax type"}
                  name={"taxType"}
                  onChange={handletaxChange}
                  style={{
                    border: "1px solid #828087",
                    height: "27px",
                    fontSize: "12px",
                    width: "100%",
                  }}
                />
              </div>
              <div className="tw-w-11/12">
                <Input
                  type={"text"}
                  label={"Rate"}
                  placeholder={"Enter tax rate"}
                  name={"rate"}
                  onChange={handletaxChange}
                  style={{
                    border: "1px solid #828087",
                    height: "27px",
                    fontSize: "12px",
                    width: "100%",
                  }}
                />
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
                  onClick={handleAddTax}
                >
                  Save
                </Button>
              </div>
            </div>
          </ModalComponent>

          <div
            className="tax-wrapper-right"
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p>Tax Groups</p>
            <button
              className="tw-px-3 tw-h-8 tw-w-28 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
              onClick={handleOpenGroup}
            >
              + New Group
            </button>
            <ModalComponent
              title={"Add new group"}
              onClose={handleCloseGroup}
              open={group}
              fade={group}
              style={{ ...baseStyle, ...modal3Style }}
            >
              <div
                className="modal-main-div"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "40px",
                  paddingTop: "1rem",
                  gap: "2rem",
                  height: "100%",
                }}
              >
                <Input
                  type={"text"}
                  label={"Tax Group Name"}
                  placeholder={"Enter Group Name"}
                  name={"groupName"}
                  onChange={handleGroupInput}
                  style={{
                    border: "1px solid #828087",
                    height: "27px",
                    fontSize: "12px",
                    width: "100%",
                  }}
                />
                <Table
                  columns={newGroupColumns}
                  rows={taxes.map((tax) => ({
                    id: tax?._id,
                    taxName: tax?.taxName,
                    percentage: tax?.rate,
                    taxId: tax?._id,
                  }))}
                  handleRowClick={handleRowClick}
                  handleNavigation={handleDashboardNavigation}
                />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingBottom: "1rem",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#8153E2",
                      color: "white",
                      height: "25px",
                    }}
                    onClick={handleAddNewGroup}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </ModalComponent>
          </div>
        </div>
        <div
          className="table-content-left tw-px-14 tw-gap-11"
          style={{
            display: "flex",
            width: "100%",
            height: "65vh",
            marginBlock: "1rem",
          }}
        >
          <Table
            columns={taxRateColumns}
            rows={taxes.map((tax) => ({
              id: tax?._id,
              taxName: tax?.taxName,
              taxType: tax?.taxType,
              rate: tax?.rate,
            }))}
            handleRowClick={handleClick}
          />
          <Table
            columns={groupHeadColumns}
            rows={groupedTaxes.flatMap((taxGroup) =>
              taxGroup?.childTaxes.map((childTax, idx) => ({
                id: taxGroup._id + idx,
                groupName: taxGroup.groupName,
                taxNames: childTax.taxName,
              }))
            )}
          />
        </div>
      </div>
      <ModalComponent
        title={`Delete invoice`}
        onClose={(e) => setDeleteModalState(!deleteModalState)}
        open={deleteModalState}
        fade={deleteModalState}
        style={{ ...baseStyle }}
      >
        <div className="tw-px-6 tw-pt-3 tw-pb-6">
          <div className="tw-text-[12px]">
            Are you sure you want to delete the selected {selectedRow?.length}{" "}
            {selectedRow?.length === 1 ? "item" : "items"} ?
          </div>
          <div className="tw-pt-3  tw-flex tw-items-end tw-justify-center tw-gap-5">
            <button
              onClick={() => setDeleteModalState(!open)}
              className="tw-px-3 tw-h-8 tw-w-24 tw-mr-5 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-[#8153E2] tw-rounded-md tw-border tw-border-[#8153E2]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={`tw-px-3 tw-h-8 tw-w-24 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-rounded-md tw-border tw-border-[#8153E2] tw-bg-[#8153E2]`}
            >
              {loading ? "Please wait" : "Delete"}
            </button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
};


export default Tax;
