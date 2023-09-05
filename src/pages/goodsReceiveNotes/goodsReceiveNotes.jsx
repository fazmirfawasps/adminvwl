import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar";
import React, { useEffect, useState } from "react";
import "../estimates/estimates.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteAllGoodsReceiveNotes,
  deleteGoodsReceiveNote,
  getAllGoodsReceiveNote,
} from "../../services/goodsReceiveNoteServices";
import { setGoodsReceiveNotes } from "../../redux/ducks/goodsReceiveNoteSlice";
import Table from "../../components/Table/Table";
import ModalComponent from "../../components/Modal/ModalComponent";

const baseStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
};

const GoodsReceiveNotes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const { goodsReceiveNotesList } = useSelector(
    (state) => state.goodsReceiveNotes
  );

  useEffect(() => {
    (async () => {
      const data = await getAllGoodsReceiveNote();
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setGoodsReceiveNotes(filteredData));
    })();
  }, [dispatch]);

  const columns = [
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

  const handleDelete = async () => {
    setLoading(true);

    let data;
    if (selectedRow?.length === goodsReceiveNotesList?.length) {
      data = await deleteAllGoodsReceiveNotes();
    } else {
      data = await deleteGoodsReceiveNote(selectedRow);
    }
    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setGoodsReceiveNotes(filteredData));
    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="estimate-wrapper tw-mt-16">
      {/* modal starting for confirmation */}
      <ModalComponent
        title={`Delete goods receive note`}
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
      <div className="dashboard">
        <DashboardNavbar
          rounded={true}
          url={"add-new-goods-receive-note"}
          selectedRow={selectedRow}
          handleNavigation={() =>
            navigate(`edit-goods-receive-note/${selectedRow[0]?._id}`)
          }
          handleDelete={() => setOpen(!open)}
        />
      </div>
      <div className="tw-h-d tw-px-14 tw-mt-2.5 tw-w-[80vw]">
        {goodsReceiveNotesList && (
          <Table
            columns={columns}
            rows={
              goodsReceiveNotesList?.length >= 0 &&
              goodsReceiveNotesList
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
                }))
            }
            handleRowClick={handleRowClick}
            handleNavigation={(e) =>
              navigate(`/purchases/goods-receive-notes/${e.row.id}`)
            }
            listOfItems={goodsReceiveNotesList}
            dashboard={false}
          />
        )}
      </div>
    </div>
  );
};

export default GoodsReceiveNotes;
