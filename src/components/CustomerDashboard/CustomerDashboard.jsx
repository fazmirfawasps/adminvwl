import React, { useState } from "react";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import "./customerDashboard.css";
import { MdDashboard, MdEmail, MdLocalPhone } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import CommonTab from "../CommonTab/CommonTab";
import { useDispatch, useSelector } from "react-redux";
import { getCustomer } from "../../redux/ducks/customerSlice";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import Table from "../Table/Table";
import { getAllCustomerTransactions } from "../../services/customerServices";
import { setEstimate, setQuote } from "../../redux/ducks/estimateSlice";
import { setSalesOrder } from "../../redux/ducks/salesOrderSlice";

const tabHeadContent = [
  { value: "1", icon: <MdDashboard />, label: "Profile" },
  { value: "2", icon: <MdDashboard />, label: "Estimates" },
  { value: "3", label: "Sales orders" },
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
    field: "customerName",
    headerName: "Customer Name",
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
    field: "customerName",
    headerName: "Customer Name",
    minWidth: 160,
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

const ProfileDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { salesOrderList } = useSelector((state) => state.salesOrders);
  const { estimatesList } = useSelector((state) => state.estimates);
  const { quotesList } = useSelector((state) => state.estimates);

  const [value, setValue] = useState("1");
  const { customersList } = useSelector((state) => state.customers);

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [selectedEstimates, setSelectedEstimates] = useState([]);
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [selectedSalesOrders, setSelectedSalesOrders] = useState([]);

  const handleMoreButtonClick = () => {
    setShowEditOptions(!showEditOptions);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 120,
      renderCell: (params) => (
        <span
          className={`tw-pr-3 ${
            params?.row?.name === selectedCustomer[0]?.firstName &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.name}
        </span>
      ),
    },
    {
      field: "credits",
      headerName: "Credits",
      type: "number",
      width: 120,
    },
  ];

  useEffect(() => {
    (async () => {
      const { estimates, quotes, salesOrders } =
        await getAllCustomerTransactions();

      dispatch(setEstimate(estimates));
      dispatch(setQuote(quotes));
      dispatch(setSalesOrder(salesOrders));
      // dispatch(getCustomer());
    })();
  }, [dispatch]);

  useEffect(() => {
    customersList && filterCustomers(id);
  }, [customersList]);

  const filterCustomers = (id) => {
    setSelectedCustomer(
      customersList?.filter((customers) => customers._id === id)
    );

    setSelectedEstimates(estimatesList.filter((x) => x.customerId === id));
    setSelectedQuotes(quotesList.filter((x) => x.customerId === id));
    setSelectedSalesOrders(salesOrderList.filter((x) => x.customerId === id));
  };

  const [isList, setIsList] = useState(false);

  const buttons = [
    {
      buttonName: <MdLocalPhone />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-ml-24 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        (window.location.href = `tel:${selectedCustomer[0]?.phone}`),
    },
    {
      buttonName: <MdEmail />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-ml-7 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        (window.location.href = `mailto:${selectedCustomer[0]?.email}`),
    },
    {
      buttonName: <FiMoreHorizontal />,
      buttonStyles:
        "tw-relative tw-h-8 tw-ml-7 tw-px-3 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
      buttonFunction: () => setIsList(!isList),
      dropDown: (
        <div className="tw-z-50 tw-absolute tw-top-5 tw-right-14 tw-opacity-100 tw-w-full tw-hover:opacity-100">
          <div>
            {isList && (
              <div className="tw-w-24 tw-mt-2 tw-p-2 tw-bg-white tw-shadow rounded tw-z-50">
                <ul>
                  <li
                    onClick={() =>
                      navigate(`/addCustomer/${selectedCustomer[0]?._id}`)
                    }
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
    filterCustomers(e?.row?.id);
  };

  return (
    <>
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          dashboard={true}
          rounded={true}
          url={"/addCustomer"}
        />
      </div>

      <div className="dashboard-content-wrapper tw-mt-14 tw-bg-white tw-px-14">
        <div className="tw-min-w-[35%] tw-max-w-[35%]">
          {customersList && (
            <Table
              columns={columns}
              rows={
                customersList &&
                customersList.length > 0 &&
                customersList.map((customer) => ({
                  id: customer?._id,
                  name: customer?.firstName,
                  amount: customer?.amount,
                }))
              }
              dashboard={true}
              handleNavigation={handleRowClick}
              listOfItems={customersList}
            />
          )}
        </div>
        <div
          className="right-content-wrapper tw-pl-5"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <DashboardCommonSection
            image={`http://localhost:8000/images/Customers/${selectedCustomer[0]?.image}`}
            number={
              selectedCustomer[0]?.firstName + selectedCustomer[0]?.lastName
            }
            name={selectedCustomer[0]?.email}
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
                    height: "60vh",
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
                    <div className="second1" 
                    // tw-w-[27%] tw-h-20 tw-flex tw-flex-col tw-items-center tw-justify-center"
                      style={{
                        width: "27% ",
                        height: "80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#FEF1D0",
                        marginInline: "1rem",
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
                          <li>{selectedCustomer[0]?.email}</li>
                          <li>{selectedCustomer[0]?.customerPhone1}</li>
                          <li>{selectedCustomer[0]?.customerPhone2}</li>
                          <li>{selectedCustomer[0]?.mobile}</li>
                          <li>{selectedCustomer[0]?.fax}</li>
                          <li>{selectedCustomer[0]?.website}</li>
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
                          <li>{selectedCustomer[0]?.customerType}</li>
                          <li>{selectedCustomer[0]?.currency}</li>
                          <li>{selectedCustomer[0]?.paymentTerms}</li>
                          <li>{selectedCustomer[0]?.placeOfSupply}</li>
                          <li>{selectedCustomer[0]?.placeOfSupplyArea}</li>
                          <li>{selectedCustomer[0]?.taxPreference}</li>
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
                          <li>{selectedCustomer[0]?.billingAddress}</li>
                          <li>Ernakulam</li>
                          <li>Kerala {selectedCustomer[0]?.postalCode}</li>
                          <li>{selectedCustomer[0]?.postalCode}</li>
                          <li>
                            Phone:{" "}
                            {selectedCustomer[0]?.billingAddressContactNumber}
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
                          <li>{selectedCustomer[0]?.deliveryAddress}</li>
                          <li>Ernakulam</li>
                          <li>Kerala {selectedCustomer[0]?.zipPostalCode}</li>
                          <li>India</li>
                          <li>
                            Phone:{" "}
                            {selectedCustomer[0]?.deliveryAddressContactNumber}
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
                    rows={selectedEstimates
                      .filter((x) => !x.blackList)
                      .map((x, idx) => ({
                        id: x._id,
                        date: x.createdAt,
                        number: "EST-" + x.estimate,
                        customerName: x.customer,
                        status: x.status,
                        amount: "₹" + x.total,
                        value: "estimate",
                      }))
                      .concat(
                        selectedQuotes
                          .filter((x) => !x.blackList)
                          .map((x, idx) => ({
                            id: x._id,
                            date: x.createdAt,
                            number: "QOT-" + x.quote,
                            customerName: x.customer,
                            status: x.status,
                            amount: "₹" + x.total,
                            value: "quote",
                          }))
                      )}
                    dashboard={true}
                  />
                </div>
              </TabPanel>
              <TabPanel value="3">
                <div className="tw-mt-4 tw-h-[427px]">
                  <Table
                    columns={column2}
                    rows={selectedSalesOrders
                      .filter((x) => !x.blackList)
                      .map((x, idx) => ({
                        id: x._id,
                        date: x.createdAt,
                        number: "SLA-" + x.salesOrder,
                        customerName: x.customer,
                        status: x.status,
                        amount: "₹" + x.total,
                        value: "salesOrder",
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

export default ProfileDashboard;
