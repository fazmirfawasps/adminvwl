import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getReceipt } from "../../redux/ducks/receiptSlice";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import generatePdf from "../EstimateDashboard/PdfGenerator";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import styled from "@emotion/styled";
import { TableCell, TableRow, tableCellClasses } from "@mui/material";
import {
  deleteRefundReceipt,
  getAllRefundReceipts,
} from "../../services/receiptServices";
import Table from "../Table/Table";
import { setRefundReceipt } from "../../redux/ducks/receiptSlice";
import DashboardDeleteModal from "../DashboardDeleteModal/DashboardDeleteModal";

const RefundReceiptDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refundReceiptsList } = useSelector((state) => state.receipts);

  const [selectedRefundReceipt, setSelectedRefundReceipt] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAllRefundReceipts();
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setRefundReceipt(filteredData));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (refundReceiptsList?.length) {
      if (initialLoading) {
        filterItems(id);
        setInitialLoading(false);
      }
    }
  }, [refundReceiptsList]);

  const filterItems = (id) => {
    const items = refundReceiptsList?.filter((x) => x._id === id);
    setSelectedRefundReceipt(items);

    const { refundReceipt, refundReceiptDate } = items[0];
    generatePdf(
      items[0],
      "Refund Receipt",
      `RET-${refundReceipt}`,
      refundReceiptDate,
      "sales"
    );
  };

  const buttons = [
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-py-[5px] tw-h-8 tw-ml-7 tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(
          `/sales/receipts/edit-refund-receipt/${selectedRefundReceipt[0]?._id}`
        ),
    },
    {
      buttonName: <AiOutlineDelete />,
      buttonStyles:
        "tw-relative tw-px-3 tw-h-8 tw-ml-7 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
      buttonFunction: () => setOpen(!open),
    },
  ];

  const columns = [
    {
      field: "number",
      headerName: "Number",
      width: 120,
      renderCell: (params) => (
        <span
          className={`${
            params?.row?.number ===
              "RET-" + selectedRefundReceipt[0]?.refundReceipt &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.number}
        </span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => (
        <span
          className={`${
            params?.row?.amount === "₹" + selectedRefundReceipt[0]?.total &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.amount}
        </span>
      ),
    },
  ];

  const handleRowClick = (e) => {
    filterItems(e?.row?.id);
  };

  const handleDelete = async () => {
    setLoading(true);

    let data = await deleteRefundReceipt(selectedRefundReceipt);

    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setRefundReceipt(filteredData));

    if (filteredData?.length) {
      filterItems(filteredData[0]?._id);
    } else {
      navigate("/sales/receipts");
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      {/* modal starting for confirmation */}
      <DashboardDeleteModal
        title={"Delete Refund Receipt"}
        message={`RET-${selectedRefundReceipt[0]?.refundReceipt}`}
        handleDelete={handleDelete}
        loading={loading}
        open={open}
        onClose={(e) => setOpen(false)}
      />
      {/* modal ending for confirmation */}
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          dashboard={true}
          rounded={true}
          url={"/sales/receipts/add-new-refund-receipt"}
        />
      </div>

      <div className="tw-flex tw-gap-5 tw-bg-white tw-mt-14 tw-px-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          {refundReceiptsList && (
            <Table
              columns={columns}
              rows={
                refundReceiptsList?.length >= 0 &&
                refundReceiptsList
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    number: "RET-" + x.refundReceipt,
                    amount: "₹" + x.total,
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={refundReceiptsList}
              dashboard={true}
            />
          )}
        </div>
        {selectedRefundReceipt && (
          <>
            <div className="tw-w-full">
              <DashboardCommonSection
                number={"RET-" + selectedRefundReceipt[0]?.refundReceipt}
                name={selectedRefundReceipt[0]?.customer}
                buttons={buttons}
              />

              <div className="tw-px-6 tw-py-6 tw-bg-[#EEE7FF] tw-rounded-xl tw-w-full z-0">
                <div className="tw-bg-white">
                  <>
                    <iframe id="pdf-preview" frameborder="0"></iframe>
                    <div
                      id="pdf-content"
                      className="tw-pt-14 tw-pr-2 tw-pl-4 tw-hidden"
                    >
                      <table id="my-table" className="tw-w-full">
                        <thead className="tw-border-x tw-border-b tw-border-[#b3adc0]">
                          <tr>
                            <th className="tw-border-r tw-border-[#b3adc0]"></th>
                            <th className="tw-border-r tw-border-[#b3adc0]"></th>
                            <th className="tw-border-r tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              HSH
                            </th>
                            <th className="tw-border-r tw-border-[#b3adc0]"></th>
                            <th className="tw-border-r tw-border-[#b3adc0]"></th>
                            <th
                              className="tw-border-r tw-border-[#b3adc0]"
                              colspan="2"
                            >
                              GGST
                            </th>
                            <th
                              className="tw-border-r tw-border-[#b3adc0]"
                              colspan="2"
                            >
                              SGST
                            </th>
                            <th></th>
                          </tr>
                          <tr>
                            <th className="tw-border-r tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              #
                            </th>
                            <th className="tw-border-r tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              Items & Description
                            </th>
                            <th className="tw-border-r tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              / SAC
                            </th>
                            <th className="tw-border-r tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              Qty
                            </th>
                            <th className="tw-border-r tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              Rate
                            </th>
                            <th className="tw-border-r tw-border-t tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              %
                            </th>
                            <th className="tw-border-r tw-border-t tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              Amt
                            </th>
                            <th className="tw-border-r tw-border-t tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              %
                            </th>
                            <th className="tw-border-r tw-border-t tw-border-[#b3adc0] tw-font-bold tw-text-xs">
                              Amt
                            </th>
                            <th className="tw-font-bold tw-text-xs">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRefundReceipt[0]?.itemDetails?.map(
                            (x, idx) => (
                              <tr>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {idx + 1}
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.itemName}
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  hi
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.primaryUnitQuantity}
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.retailPrice}
                                </td>

                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  January
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  $10,000
                                </td>

                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  January
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  $10,000
                                </td>

                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.primaryUnitQuantity * x.retailPrice}.00
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RefundReceiptDashboard;
