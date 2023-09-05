import "./estimates.css";
import Box from "@mui/material/Box";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import CommonTab from "../../components/CommonTab/CommonTab";
import {
  getEstimate,
  setEstimate,
  setQuote,
} from "../../redux/ducks/estimateSlice";
import {
  deleteAllEstimates,
  deleteAllEstimatesAndQuotes,
  deleteAllQuotes,
  deleteBothEstimateAndQuote,
  deleteEstimate,
  deleteQuote,
  getAllQuotes,
} from "../../services/estimateServices";
import ModalComponent from "../../components/Modal/ModalComponent";

const tabHeadContent = [
  { value: "1", label: "All" },
  { value: "2", label: "Estimates" },
  { value: "3", label: "Quotes" },
];

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

function Estimates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const { estimatesList, quotesList } = useSelector((state) => state.estimates);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(getEstimate());
    (async () => {
      const data = await getAllQuotes();
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setQuote(filteredData));
    })();
  }, [dispatch]);

  useEffect(() => {
    setSelectedRow([]);
  }, [value]);

  const columns = [
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

  const handleRowClick = (e, listOfItems) => {
    const id = e?.row?.id;

    if (!id) {
      if (e?.length) {
        const items = e.map((item1) => {
          const matchedItem = listOfItems.find((item2) => item2._id === item1);
          return { ...matchedItem };
        });

        return setSelectedRow(items);
      }

      setSelectedRow([]);
      return;
    }

    if (selectedRow?.length) {
      const exist = selectedRow?.filter((x) => x._id === id);

      if (exist?.length) {
        const filteredItems = selectedRow?.filter((x) => x._id !== id);
        setSelectedRow(filteredItems);
      }
    }
  };

  const handleDashboardNavigation = (e) => {
    const id = e?.row?.id;

    e.row.value === "estimate"
      ? navigate(`/sales/estimates/${id}`)
      : navigate(`/sales/quotes/${id}`);
  };

  const handleNavigation = (url) => {
    navigate(url);
  };

  const handleDeleteDispatching = (estimates, quotes) => {
    dispatch(setEstimate(estimates));
    dispatch(setQuote(quotes));
  };

  const handleDelete = async () => {
    setLoading(true);
    if (value === "1") {
      if (selectedRow?.length === estimatesList?.length + quotesList?.length) {
        // delete both estimates and quotes
        console.log(
          "condition are matching for deleting both estimate and quotes"
        );

        const { quotesList, estimatesList } =
          await deleteAllEstimatesAndQuotes();
        handleDeleteDispatching(estimatesList, quotesList);
      } else {
        // delete estimate and quotes

        const estimates = [];
        const quotes = [];

        selectedRow?.forEach((x) => {
          if (x.hasOwnProperty("estimate")) estimates.push(x);
          if (x.hasOwnProperty("quote")) quotes.push(x);
        });
        const { quotesList, estimatesList } = await deleteBothEstimateAndQuote(
          estimates,
          quotes
        );

        const filteredEstimates = estimatesList?.filter((x) => !x.blackList);
        const filteredQuotes = quotesList?.filter((x) => !x.blackList);
        handleDeleteDispatching(filteredEstimates, filteredQuotes);
      }
    } else if (value === "2") {
      let data;
      if (selectedRow?.length === estimatesList?.length) {
        // delete all estimates
        console.log("condition are matching for deleting all estimates");
        data = await deleteAllEstimates();
      } else {
        // delete estimates
        data = await deleteEstimate(selectedRow);
      }
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setEstimate(filteredData));
    } else if (value === "3") {
      let data;
      if (selectedRow?.length === quotesList?.length) {
        // delete all quotes
        console.log("condition are matching for deleting all quotes");
        data = await deleteAllQuotes();
      } else {
        console.log(selectedRow?.length, quotesList?.length);
        // delete quotes
        data = await deleteQuote(selectedRow);
      }
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setQuote(filteredData));
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <div className="estimate-wrapper tw-mt-16">
        <Box sx={{ width: "100%" }}>
          {/* modal starting for confirmation */}
          <ModalComponent
            title={`${
              value === "1"
                ? "Delete all"
                : value === "2"
                ? "Delete estimate"
                : "Delete quote"
            }`}
            onClose={(e) => setOpen(false)}
            open={open}
            fade={open}
            style={{ ...baseStyle }}
          >
            <div className="tw-px-6 tw-pt-3 tw-pb-6">
              <div className="tw-text-[12px]">
                Are you sure you want to delete the selected{" "}
                {selectedRow?.length}{" "}
                {selectedRow?.length === 1 ? "item" : "items"} ?
              </div>
              <div className="tw-pt-3  tw-flex tw-items-end tw-justify-center tw-gap-5">
                <button
                  onClick={() => setOpen(!open)}
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

          {/* modal ending for confirmation */}
          <CommonTab
            onChange={handleChange}
            value={value}
            tabHeadContent={tabHeadContent}
          >
            <div className="dashboard">
              <DashboardNavbar
                url={
                  value === "1"
                    ? "add-new-estimate"
                    : value === "2"
                    ? "add-new-estimate"
                    : "add-new-quote"
                }
                tabLinks={
                  value === "1"
                    ? [
                        { name: "Add Estimate", url: "add-new-estimate" },
                        { name: "Add Quote", url: "add-new-quote" },
                      ]
                    : []
                }
                selectedRow={selectedRow}
                handleNavigation={() =>
                  handleNavigation(
                    `${
                      value === "1" &&
                      selectedRow[0]?.hasOwnProperty("estimate")
                        ? `edit-estimate/${selectedRow[0]?._id}`
                        : value === "1" &&
                          selectedRow[0]?.hasOwnProperty("quote")
                        ? `edit-quote/${selectedRow[0]?._id}`
                        : value === "2"
                        ? `edit-estimate/${selectedRow[0]?._id}`
                        : `edit-quote/${selectedRow[0]?._id}`
                    }`
                  )
                }
                handleDelete={() => setOpen(!open)}
              />
            </div>
            <TabPanel
              sx={{ height: "70vh", padding: "0px 3.5rem", marginTop: "10px" }}
              value="1"
            >
              {estimatesList && quotesList && (
                <Table
                  columns={columns}
                  rows={
                    estimatesList?.length >= 0 &&
                    estimatesList
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
                        quotesList?.length >= 0 &&
                          quotesList
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
                      )
                  }
                  handleRowClick={handleRowClick}
                  handleNavigation={handleDashboardNavigation}
                  listOfItems={estimatesList.concat(quotesList)}
                  dashboard={false}
                />
              )}
            </TabPanel>

            <TabPanel
              value="2"
              sx={{ height: "70vh", padding: "0px 3.5rem", marginTop: "10px" }}
            >
              {estimatesList && (
                <Table
                  columns={columns}
                  rows={
                    estimatesList?.length >= 0 &&
                    estimatesList
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
                  }
                  handleRowClick={handleRowClick}
                  handleNavigation={handleDashboardNavigation}
                  listOfItems={estimatesList}
                  dashboard={false}
                />
              )}
            </TabPanel>
            <TabPanel
              value="3"
              sx={{ height: "70vh", padding: "0px 3.5rem", marginTop: "10px" }}
            >
              {quotesList && (
                <Table
                  columns={columns}
                  rows={
                    quotesList?.length >= 0 &&
                    quotesList
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
                  }
                  handleRowClick={handleRowClick}
                  handleNavigation={handleDashboardNavigation}
                  listOfItems={quotesList}
                  dashboard={false}
                />
              )}
            </TabPanel>
          </CommonTab>
        </Box>
      </div>
    </>
  );
}

export default Estimates;
