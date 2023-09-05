import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { FiMoreHorizontal } from "react-icons/fi";
import CommonTab from "../CommonTab/CommonTab";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { TbNotes, TbReportAnalytics } from "react-icons/tb";
import { BiBorderAll } from "react-icons/bi";
import Classes from "./ItemDashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../redux/ducks/itemSlice";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import Table from "../Table/Table";

const head = [{ value: "Name" }, { value: "Price" }];

const tabHeadContent = [
  { value: "1", icon: <BiBorderAll />, label: "Overview" },
  { value: "2", icon: <TbNotes />, label: "Notes" },
  { value: "3", icon: <TbReportAnalytics />, label: "Transactions" },
];

const ItemDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, itemCounts } = useSelector((state) => state.items);
  console.log(data, "dataaaaaaaaaaaaaa");

  const [value, setValue] = useState("1");
  const { items } = useSelector((state) => state);
  const [selectedItem, setSelectedItem] = useState([]);
  console.log(selectedItem[0], "selecteditem ");
  const [showEditOptions, setShowEditOptions] = useState(false);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 120,
      renderCell: (params) => (
        <span
          className={`tw-pr-3 ${
            params?.row?.name === selectedItem[0]?.itemName &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.name}
        </span>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 120,
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMoreButtonClick = () => {
    setShowEditOptions(!showEditOptions);
  };

  useEffect(() => {
    data && filterItems(id);
  }, [data]);

  // useEffect(() => {
  //   dispatch(getItem());
  // }, [dispatch]);

  const filterItems = (id) => {
    setSelectedItem(data?.filter((items) => items._id === id));
  };

  const [isList, setIsList] = useState(false);

  const buttons = [
    {
      buttonName: <FiMoreHorizontal />,
      buttonStyles:
        "tw-relative tw-px-3 tw-h-8 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
      buttonFunction: () => setIsList(!isList),
      dropDown: (
        <div className="tw-z-50 tw-absolute tw-top-5 tw-right-14 tw-opacity-100 tw-w-full tw-hover:opacity-100">
          <div>
            {isList && (
              <div className="tw-w-24 tw-mt-2 tw-p-2 tw-bg-white tw-shadow rounded tw-z-50">
                <ul>
                  <li
                    onClick={() => navigate(`/addItem/${selectedItem[0]?._id}`)}
                    className="tw-text-sm hover:tw-bg-[#EEE7FF] tw-py-1"
                  >
                    Edit
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];
  const handleRowClick = (e) => {
    filterItems(e?.row?.id);
  };

  return (
    <>
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          dashboard={true}
          rounded={true}
          url={"/addItem"}
        />
      </div>

      <div className="dashboard-content-wrapper tw-mt-14 tw-bg-white tw-gap-5 tw-px-14">
        <div className="tw-min-w-[35%] tw-max-w-[35%]">
          {data && (
            <Table
              columns={columns}
              rows={
                data &&
                data.length > 0 &&
                data.map((item) => ({
                  id: item?._id,
                  name: item?.itemName,
                  price: item?.price,
                }))
              }
              dashboard={true}
              handleNavigation={handleRowClick}
              listOfItems={data}
            />
          )}
        </div>

        <div
          className="right-content-wrapper"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* <div className="profile-area">
            <div className="profile-section">
              <div className="main1" style={{ display: 'flex', width: '50%', paddingInline: '2rem' }} >
                <div className="profile-img">
                  <img src={`http://localhost:8000/images/Items/${selectedItem[0]?.image}`} alt="kxencelogo" />
                </div>
                <div className="userDetails-div">
                  <div className="name" style={{ fontSize: '20px', color: '#000000' }} >
                    <h5>{selectedItem[0]?.itemName} {selectedItem[0]?.itemName} </h5>
                  </div>
                  <div className="email" style={{ color: '#828087', fontSize: '12px' }}  >
                    <span>{item.email}</span>
                  </div>
                </div>
              </div>
              <div className="main2" style={{ width: '50%', display: 'flex', color: '#8153E2', justifyContent: 'space-around' }}  >
                <div style={{ display: 'flex', gap: '2rem' }}>

                  <div className="tooltip" style={{ width: '30px', height: '30px', background: '#EEE7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }} >
                    <MdLocalPhone style={{ cursor: 'pointer' }} onClick={() => {
                      window.location.href = `tel:${item.phone}`;
                    }} title={item.phone} />
                  </div>
                  <div className="tooltip" style={{ background: '#EEE7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '4px' }}  >
                    <MdEmail style={{ cursor: 'pointer' }} onClick={() => {
                      window.location.href = `mailto:${item.email}`;
                    }} title={item.email} />
                  </div>
                  <div className="more-button-container" style={{ border: '2px solid #d6e2d79c', width: '40px', height: '30px' }} >
                    <span className='more-button'  >
                      <FiMoreHorizontal onClick={handleMoreButtonClick} />                    </span>
                    {showEditOptions && (
                      <div>

                        <ul className="edit-options-list">
                          <li onClick={() => {
                            navigate(`/addItem/${selectedItem[0]?._id}`)
                          }} >Edit</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <DashboardCommonSection
            image={`http://localhost:8000/images/Items/${selectedItem[0]?.image}`}
            number={selectedItem[0]?.itemName}
            status={"In stock"}
            category={`${
              selectedItem[0]?.category?.name
                ? selectedItem[0].category?.name
                : "Not fetched"
            } > ${
              selectedItem[0]?.newOne[0]?.name
                ? selectedItem[0].newOne[0]?.name
                : "Not fetched"
            }`}
            description={selectedItem[0]?.itemDescription}
            price={"₹" + selectedItem[0]?.retailPrice}
            buttons={buttons}
          />

          <div>
            <CommonTab
              tabHeadContent={tabHeadContent}
              value={value}
              onChange={handleChange}
              dashboard={true}
            >
              <TabPanel value="1">
                <div
                  style={{
                    color: "black",
                    border: "2px solid #d6e2d79c",
                    height: "60vh",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    marginTop: "1rem",
                    overflowY: "scroll",
                  }}
                >
                  <div
                    className="firstDiv"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      height: "3rem",
                      alignItems: "center",
                      paddingInline: "2rem",
                      fontSize: "14px",
                      color: "#545357",
                    }}
                  >
                    <h4>Stats</h4>
                  </div>
                  <div
                    className="secondMaindiv"
                    style={{
                      display: "flex",
                      paddingInline: "1rem",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="second1"
                      style={{
                        background: "#FED0D0",
                        width: "27% ",
                        height: "80px",
                        marginInline: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        borderLeft: "4px solid #CE5133",
                        borderTopLeftRadius: "5px",
                        borderRadius: "10px",
                        paddingInline: "1rem",
                        color: "#545357",
                      }}
                    >
                      <p style={{ fontSize: "23px" }}>&#x20b9; 20000</p>
                      <p style={{ fontSize: "14px" }}>OVERDUE</p>
                    </div>
                    <div
                      className="second1"
                      style={{
                        background: "#FEF1D0",
                        width: "27% ",
                        height: "80px",
                        marginInline: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderLeft: "4px solid #F2B735",
                        borderTopLeftRadius: "5px",
                        borderRadius: "10px",
                        paddingInline: "1rem",
                        color: "#545357",
                      }}
                    >
                      <p style={{ fontSize: "23px" }}>&#x20b9; 19060</p>
                      <div
                        style={{
                          width: "60%",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <p style={{ fontSize: "14px" }}>OPEN</p>
                      </div>
                    </div>
                    <div
                      className="second1"
                      style={{
                        background: "#D0FEE2",
                        width: "27% ",
                        height: "80px",
                        marginInline: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderLeft: "4px solid #33CE8D",
                        borderTopLeftRadius: "5px",
                        borderRadius: "10px",
                        paddingInline: "1rem",
                        color: "#545357",
                      }}
                    >
                      <p style={{ fontSize: "23px" }}>&#x20b9; 420,000</p>
                      <div
                        style={{
                          width: "60%",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <p style={{ fontSize: "14px" }}>SALE</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="firstDiv"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      height: "3rem",
                      alignItems: "center",
                      paddingInline: "2rem",
                      fontSize: "14px",
                      color: "#545357",
                      marginTop: "2rem",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        width: "100%",
                      }}
                    >
                      <h4
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        Stock Details
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          padding: "10px 5px",
                          borderBlock: "1px solid #CECECE",
                          width: "100%",
                        }}
                      >
                        <div className={Classes.stockDetails_content}>
                          <p>Stock Quantity</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Quantity Status</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Stock Keeping Unit</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Primary Unit</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Conversion</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* //heree// */}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        width: "100%",
                      }}
                    >
                      <h4
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        Price Details
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          padding: "10px 5px",
                          borderBlock: "1px solid #CECECE",
                          width: "100%",
                        }}
                      >
                        <div className={Classes.stockDetails_content}>
                          <p>MaxRetail Price</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Selling Price</p>
                          <p>
                            <b> 200</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Purchase Price</p>
                          <p>
                            <b> {selectedItem[0]?.purchasePrice}</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Wholesale Price</p>
                          <p>
                            <b>{selectedItem[0]?.wholesalePrice}</b>{" "}
                          </p>
                        </div>
                        <div className={Classes.stockDetails_content}>
                          <p>Min Quantity</p>
                          <p>
                            <b>{selectedItem[0]?.minQuantity}</b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* //third */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        width: "100%",
                      }}
                    >
                      <h4
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        Tax Details
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          padding: "10px 5px",
                          borderBlock: "1px solid #CECECE",
                          width: "100%",
                        }}
                      >
                        <div className={Classes.stockDetails_content}>
                          <p>Taxable</p>
                          <p>
                            <b>{selectedItem[0]?.taxPreference}</b>{" "}
                          </p>
                        </div>
                        {/* <div className={Classes.stockDetails_content} >
                          <p>Quantity Status</p>
                          <p ><b> 200</b> </p>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </CommonTab>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDashboard;
