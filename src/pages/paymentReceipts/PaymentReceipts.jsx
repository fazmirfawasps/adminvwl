import React, { useEffect, useState } from "react";
import "../estimates/estimates.css";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentReceipt } from "../../redux/ducks/paymentReceiptsSlice";
import { useNavigate } from "react-router-dom";
import {
  deleteAllPaymentReceipts,
  deletePaymentReceipt,
  getAllPaymentReceipts,
} from "../../services/paymentReceipts";
import ModalComponent from "../../components/Modal/ModalComponent";
import Table from "../../components/Table/Table";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

function PaymentReceipts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const { paymentReceiptsList } = useSelector((state) => state.paymentReceipts);
  console.log(paymentReceiptsList);
  useEffect(() => {
    (async () => {
      const data = await getAllPaymentReceipts();
      const filteredData = data?.filter((x) => !x.blackList);

      dispatch(setPaymentReceipt(filteredData));
    })();
  }, [dispatch]);

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
      field: "billNumber",
      headerName: "Bill Number",
      width: 160,
    },
    {
      field: "amountReceived",
      headerName: "Amount Received",
      width: 130,
      renderCell: (params) =>
        params?.row?.status && (
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
      field: "balanceAmount",
      headerName: "BalanceAmount",
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

  const handleNavigation = (url) => {
    navigate(url);
  };

  const handleDelete = async () => {
    setLoading(true);
    let data;

    if (selectedRow?.length === paymentReceiptsList?.length) {
      data = await deleteAllPaymentReceipts();
    } else {
      data = await deletePaymentReceipt(selectedRow);
    }

    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setPaymentReceipt(filteredData));

    setLoading(false);
    setOpen(false);
  };
  return (
    <>
      <div className="estimate-wrapper tw-mt-16">
        {/* modal starting for confirmation */}
        <ModalComponent
          title={"Delete payment receipt"}
          onClose={(e) => setOpen(false)}
          open={open}
          fade={open}
          style={{ ...baseStyle }}
        >
          <div className="tw-px-6 tw-pt-3 tw-pb-6">
            <div className="tw-text-[12px]">
              Are you sure you want to delete the selected {selectedRow?.length}{" "}
              {selectedRow?.length === 1 ? "item" : "items"} ?
            </div>
            <div className="tw-pt-3 tw-flex tw-items-end tw-justify-center tw-gap-5">
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

        <div className="dashboard">
          <DashboardNavbar
            rounded={true}
            url={"add-new-payment-receipt"}
            selectedRow={selectedRow}
            handleNavigation={() =>
              handleNavigation(`edit-payment-receipt/${selectedRow[0]?._id}`)
            }
            handleDelete={() => setOpen(!open)}
          />
        </div>
        <div className="tw-h-d tw-px-14 tw-mt-2.5 tw-w-[80vw]">
          {paymentReceiptsList && (
            <Table
              columns={columns}
              rows={
                paymentReceiptsList?.length >= 0 &&
                paymentReceiptsList
                  .filter((y) => !y.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    date: x.createdAt,
                    number: "PAY-" + x.paymentReceipt,
                    billNumber: "BIL-" + x.itemDetails?.bill,
                    amountReceived: "₹" + x.itemDetails?.paying,
                    balanceAmount:
                      "₹" +
                      (x.itemDetails?.total -
                        (x.itemDetails?.payed + x.itemDetails?.paying)),
                    value: "paymentReceipt",
                  }))
              }
              handleRowClick={handleRowClick}
              handleNavigation={(e) =>
                navigate(`/purchases/payment-receipts/${e.row.id}`)
              }
              listOfItems={paymentReceiptsList}
              dashboard={false}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentReceipts;
