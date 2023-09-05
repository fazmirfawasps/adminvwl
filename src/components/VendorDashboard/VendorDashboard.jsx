import React, { useState } from "react";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import "../CustomerDashboard/customerDashboard.css";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import {
  MdDashboard,
  MdEmail,
  MdLocalPhone,
  MdOutlineArrowBackIos,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate, useParams } from "react-router-dom";
import { GrNote } from "react-icons/gr";
import { TbReportAnalytics } from "react-icons/tb";
import { useEffect } from "react";
import CommonTab from "../CommonTab/CommonTab";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllVendors,
  getAllVendorTransactions,
} from "../../services/vendorServices";
import { setVendor } from "../../redux/ducks/vendorSlice";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import Table from "../Table/Table";
import { setGoodsReceiveNotes } from "../../redux/ducks/goodsReceiveNoteSlice";
import { setBill } from "../../redux/ducks/billSlice";
import { setPurchaseOrder } from "../../redux/ducks/purchaseOrderSlice";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const tabHeadContent = [
  { value: "1", icon: <MdDashboard />, label: "Profile" },
  { value: "2", label: "Purchase orders" },
  { value: "3", label: "Bills" },
  { value: "4", label: "Goods receive notes" },
];

const column1 = [
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
  { field: "number", headerName: "Number", width: 130 },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    width: 160,
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <span
        className={`tw-px-3 ${
          params?.row?.status === "Accepted"
            ? "tw-bg-[#AAFDD5] tw-text-[#005503]"
            : params?.row?.status === "Draft"
            ? "tw-bg-[#DADADA] tw-text-[#454545]"
            : params?.row?.status === "Send"
            ? "tw-bg-[#ADE0FD] tw-text-[#2077A8]"
            : params?.row?.status === "Viewed"
            ? "tw-bg-[#AABCFD] tw-text-[#110079]"
            : params?.row?.status === "Invoiced"
            ? "tw-bg-[#CEAAFD] tw-text-[#580989]"
            : params?.row?.status === "Expired"
            ? "tw-bg-[#FDAAAA] tw-text-[#830000]"
            : params?.row?.status === "Declined"
            ? "tw-bg-[#FDBEAA] tw-text-[#AA0404]"
            : "tw-bg-red-600"
        }`}
      >
        {params?.row?.status}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 120,
  },
];

const column2 = [
  {
    field: "date",
    headerName: "Date",
    minWidth: 130,
    headerClassName: "tw-bg-[#EEE7FF]",
    renderCell: (params) => {
      const formattedDate = new Date(params?.row?.date).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      );
      return <div>{formattedDate}</div>;
    },
  },
  { field: "number", headerName: "Number", minWidth: 130 },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    minWidth: 160,
  },
  {
    field: "expiryDate",
    headerName: "Due Date",
    minWidth: 130,
    headerClassName: "tw-bg-[#EEE7FF]",
    renderCell: (params) => {
      const formattedDate = new Date(params?.row?.dueDate).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      );
      return <div>{formattedDate}</div>;
    },
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 120,
    renderCell: (params) => (
      <span
        className={`tw-px-3 ${
          params?.row?.status === "Accepted"
            ? "tw-bg-[#AAFDD5] tw-text-[#005503]"
            : params?.row?.status === "Draft"
            ? "tw-bg-[#DADADA] tw-text-[#454545]"
            : params?.row?.status === "Send"
            ? "tw-bg-[#ADE0FD] tw-text-[#2077A8]"
            : params?.row?.status === "Viewed"
            ? "tw-bg-[#AABCFD] tw-text-[#110079]"
            : params?.row?.status === "Invoiced"
            ? "tw-bg-[#CEAAFD] tw-text-[#580989]"
            : params?.row?.status === "Expired"
            ? "tw-bg-[#FDAAAA] tw-text-[#830000]"
            : params?.row?.status === "Declined"
            ? "tw-bg-[#FDBEAA] tw-text-[#AA0404]"
            : "tw-bg-red-600"
        }`}
      >
        {params?.row?.status}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    minWidth: 120,
  },
];

const column3 = [
  {
    field: "date",
    headerName: "Date",
    minWidth: 130,
    headerClassName: "tw-bg-[#EEE7FF]",
    renderCell: (params) => {
      const formattedDate = new Date(params?.row?.date).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      );
      return <div>{formattedDate}</div>;
    },
  },
  { field: "number", headerName: "Number", minWidth: 130 },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    minWidth: 160,
  },
  {
    field: "expiryDate",
    headerName: "Due Date",
    minWidth: 130,
    headerClassName: "tw-bg-[#EEE7FF]",
    renderCell: (params) => {
      const formattedDate = new Date(params?.row?.dueDate).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      );
      return <div>{formattedDate}</div>;
    },
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 120,
    renderCell: (params) => (
      <span
        className={`tw-px-3 ${
          params?.row?.status === "Accepted"
            ? "tw-bg-[#AAFDD5] tw-text-[#005503]"
            : params?.row?.status === "Draft"
            ? "tw-bg-[#DADADA] tw-text-[#454545]"
            : params?.row?.status === "Send"
            ? "tw-bg-[#ADE0FD] tw-text-[#2077A8]"
            : params?.row?.status === "Viewed"
            ? "tw-bg-[#AABCFD] tw-text-[#110079]"
            : params?.row?.status === "Invoiced"
            ? "tw-bg-[#CEAAFD] tw-text-[#580989]"
            : params?.row?.status === "Expired"
            ? "tw-bg-[#FDAAAA] tw-text-[#830000]"
            : params?.row?.status === "Declined"
            ? "tw-bg-[#FDBEAA] tw-text-[#AA0404]"
            : "tw-bg-red-600"
        }`}
      >
        {params?.row?.status}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    minWidth: 120,
  },
];

const VendorDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vendorsList } = useSelector((state) => state.vendors);
  const { purchaseOrdersList } = useSelector((state) => state.purchaseOrders);
  const { billsList } = useSelector((state) => state.bill);
  const { goodsReceiveNotesList } = useSelector(
    (state) => state.goodsReceiveNotes
  );

  const [value, setValue] = useState("1");
  // const [storedClient, setStoredClinet] = useState([]);
  // const [client, setClient] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [active, setActive] = useState(null);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedPurchaseOrders, setSelectedPurchaseOrders] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [selectedGoodsReceiveNotes, setSelectedGoodsReceiveNotes] = useState(
    []
  );

  const handleMoreButtonClick = () => {
    setShowEditOptions(!showEditOptions);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    (async () => {
      const { data } = await fetchAllVendors();
      const { purchaseOrders, bills, goodsReceiveNotes } =
        await getAllVendorTransactions();

      dispatch(setPurchaseOrder(purchaseOrders));
      dispatch(setBill(bills));
      dispatch(setGoodsReceiveNotes(goodsReceiveNotes));
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setVendor(filteredData));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (vendorsList?.length) {
      filterVendors(id);
    }
  }, [vendorsList]);

  const filterVendors = (id) => {
    setSelectedVendor(vendorsList.filter((vendors) => vendors._id === id));

    setSelectedPurchaseOrders(
      purchaseOrdersList.filter((x) => x.vendorId === id)
    );
    setSelectedBills(billsList.filter((x) => x.vendorId === id));
    setSelectedGoodsReceiveNotes(
      goodsReceiveNotesList.filter((x) => x.vendorId === id)
    );
  };

  const [isList, setIsList] = useState(false);

  const buttons = [
    {
      buttonName: <MdLocalPhone />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-ml-24 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        (window.location.href = `tel:${selectedVendor[0]?.mobileNumber}`),
    },
    {
      buttonName: <MdEmail />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-ml-7 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        (window.location.href = `mailto:${selectedVendor[0]?.email}`),
    },
    {
      buttonName: <FiMoreHorizontal />,
      buttonStyles:
        "tw-relative tw-h-8 tw-ml-7 tw-px-3 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
      buttonFunction: () => setIsList(!isList),
      dropDown: isList && (
        <ul className="tw-absolute tw-w-32 tw-right-0 tw-top-9 tw-z-50 tw-bg-white tw-shadow-lg tw-rounded-md">
          <li
            onClick={() =>
              navigate(
                `/purchases/vendors/edit-vendor/${selectedVendor[0]?._id}`
              )
            }
            className="tw-text-xs tw-h-8 tw-text-start tw-text-black hover:tw-bg-[#8153E2] hover:tw-text-white tw-p-2 tw-pl-4 tw-rounded-md"
          >
            Edit
          </li>
        </ul>
      ),
    },
  ];

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 120,
      renderCell: (params) => (
        <span
          className={`${
            params?.row?.name ===
              selectedVendor[0]?.firstName + selectedVendor[0]?.lastName &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.name}
        </span>
      ),
    },
    {
      field: "credit",
      headerName: "Credit",
      width: 120,
      renderCell: (params) => (
        <span
          className={`${
            params?.row?.credit === selectedVendor[0]?.mobileNumber &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.credit}
        </span>
      ),
    },
  ];

  const handleRowClick = (e) => {
    filterVendors(e?.row?.id);
  };

  return (
    <>
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          dashboard={true}
          rounded={true}
          url={"/purchases/vendors/add-new-vendor"}
        />
      </div>

      <div className="tw-flex tw-mt-14 tw-px-14 tw-bg-white tw-min-h-[600px]">
        <div className="tw-min-w-[35%] tw-max-w-[35%] tw-my-2">
          {vendorsList && (
            <Table
              columns={columns}
              rows={
                vendorsList?.length >= 0 &&
                vendorsList
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    name: x.firstName + x.lastName,
                    credit: x.mobileNumber,
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={vendorsList}
              dashboard={true}
            />
          )}
        </div>
        <div
          className="right-content-wrapper tw-pl-5"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <DashboardCommonSection
            image={`http://localhost:8000/images/Vendors/${selectedVendor[0]?.image}`}
            number={selectedVendor[0]?.firstName + selectedVendor[0]?.lastName}
            name={selectedVendor[0]?.email}
            buttons={buttons}
          />

          <div>
            <CommonTab
              tabHeadContent={tabHeadContent}
              onChange={handleChange}
              value={value}
              dashboard={true}
            >
              <TabPanel value="1">
                <div
                  style={{
                    color: "black",
                    border: "2px solid #d6e2d79c",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    marginTop: "1rem",
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
                        alignItems: "end",
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
                        alignItems: "end",
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
                        alignItems: "end",
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
                    className="thirdMaindiv"
                    style={{
                      display: "flex",
                      width: "100%",
                      paddingBlock: "0.5rem",
                      borderBottom: "2px solid #d6e2d79c",
                      paddingInline: "1rem",
                    }}
                  >
                    <div
                      className="third1"
                      style={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div className="address-div">
                        <h7>General Details</h7>
                      </div>
                      <div style={{ display: "flex" }}>
                        <ul
                          style={{
                            listStyle: "none",
                            width: "30%",
                            textAlign: "justify",
                            fontSize: "10px",
                            lineHeight: "20px",
                            paddingInline: "1rem",
                            color: " #545357 ",
                          }}
                        >
                          <li>Email</li>
                          <li>Phone 01</li>
                          <li>Phone 02</li>
                          <li>Mobile</li>
                          <li>Fax</li>
                          <li>Website</li>
                        </ul>
                        <ul
                          style={{
                            listStyle: "none",
                            width: "45%",
                            textAlign: "justify",
                            fontSize: "10px",
                            lineHeight: "20px",
                            paddingInline: "1rem",
                            color: " #545357 ",
                          }}
                        >
                          <li>{selectedVendor[0]?.email}</li>
                          <li>{selectedVendor[0]?.workPhone1}</li>
                          <li>{selectedVendor[0]?.workPhone2}</li>
                          <li>{selectedVendor[0]?.mobileNumber}</li>
                          <li>Fax</li>
                          <li>{selectedVendor[0]?.website}</li>
                        </ul>
                      </div>
                    </div>

                    <div
                      className="third2"
                      style={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div className="address-div">
                        <h7>Other Details</h7>
                      </div>

                      <div style={{ display: "flex" }}>
                        <ul
                          style={{
                            listStyle: "none",
                            width: "40%",
                            textAlign: "justify",
                            fontSize: "10px",
                            lineHeight: "20px",
                            paddingInline: "1rem",
                            color: " #545357 ",
                          }}
                        >
                          <li>Customer type</li>
                          <li>Currency</li>
                          <li>Payment Terms</li>
                          <li>Place of Supply</li>
                          <li>Delivery Area</li>
                          <li>Tax prefernce</li>
                        </ul>
                        <ul
                          style={{
                            listStyle: "none",
                            width: "45%",
                            textAlign: "justify",
                            fontSize: "10px",
                            lineHeight: "20px",
                            paddingInline: "1rem",
                            color: " #545357 ",
                          }}
                        >
                          <li>{selectedVendor[0]?.vendorType}</li>
                          <li>{selectedVendor[0]?.currency}</li>
                          <li>
                            <span className="tw-truncate">
                              {selectedVendor[0]?.paymentTerms}
                            </span>
                          </li>
                          <li>Kerala</li>
                          <li>{selectedVendor[0]?.area}</li>
                          <li>{selectedVendor[0]?.taxPreference}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className="lastmaindiv"
                    style={{
                      display: "flex",
                      width: "100%",
                      paddingInline: "1rem",
                      paddingBottom: "4px",
                    }}
                  >
                    <div
                      className="first"
                      style={{
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                      }}
                    >
                      <div className="address-div">
                        <h7>Billing Address</h7>
                      </div>
                      <div>
                        <ul className="address-ul">
                          <li>
                            <span>{selectedVendor[0]?.billingAddress}</span>
                          </li>
                          <li>
                            {selectedVendor[0]?.billingState +
                              ", " +
                              selectedVendor[0]?.billingZipOrPostalCode}
                          </li>
                          <li>
                            Phone: {selectedVendor[0]?.billingContactNumber}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div
                      className="second"
                      style={{
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                      }}
                    >
                      <div className="address-div">
                        <h7>Shipping Address</h7>
                      </div>
                      <div>
                        <ul className="address-ul">
                          <li>
                            <span>{selectedVendor[0]?.deliveryAddress}</span>
                          </li>
                          <li>
                            {selectedVendor[0]?.deliveryState +
                              ", " +
                              selectedVendor[0]?.deliveryZipOrPostalCode}
                          </li>
                          <li>
                            Phone: {selectedVendor[0]?.deliveryContactNumber}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="third"></div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="tw-mt-4 tw-h-[427px]">
                  <Table
                    columns={column1}
                    rows={selectedPurchaseOrders
                      .filter((x) => !x.blackList)
                      .map((x, idx) => ({
                        id: x._id,
                        date: x.createdAt,
                        number: "PSO-" + x.purchaseOrder,
                        vendorName: x.vendor,
                        status: x.status,
                        amount: "₹" + x.total,
                        value: "purchaseOrder",
                      }))}
                    dashboard={true}
                  />
                </div>
              </TabPanel>
              <TabPanel value="3">
                <div className="tw-mt-4 tw-h-[427px]">
                  <Table
                    columns={column2}
                    rows={selectedBills
                      .filter((x) => !x.blackList)
                      .map((x, idx) => ({
                        id: x._id,
                        date: x.createdAt,
                        number: "BIL-" + x.bill,
                        vendorName: x.vendor,
                        dueDate: x.expiryDate,
                        status: x.status,
                        amount: "₹" + x.total,
                        value: "vendor",
                      }))}
                    dashboard={true}
                  />
                </div>
              </TabPanel>
              <TabPanel value="4">
                <div className="tw-mt-4 tw-h-[427px]">
                  <Table
                    columns={column3}
                    rows={selectedGoodsReceiveNotes
                      .filter((x) => !x.blackList)
                      .map((x, idx) => ({
                        id: x._id,
                        date: x.createdAt,
                        number: "GRN-" + x.goodsReceiveNote,
                        vendorName: x.vendor,
                        dueDate: x.expiryDate,
                        status: x.status,
                        amount: "₹" + x.total,
                        value: "goodsReceiveNote",
                      }))}
                    dashboard={true}
                  />
                </div>
              </TabPanel>
            </CommonTab>
            {/* <TabPanel value="2">Item Two</TabPanel> */}
            {/* <TabPanel value="3">Item Three</TabPanel> */}
            {/* </TabContext> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
