import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getReceipt } from "../../redux/ducks/receiptSlice";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import generatePdf from "../EstimateDashboard/PdfGenerator";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import {
  deletePaymentReceipt,
  getAllPaymentReceipts,
} from "../../services/receiptServices";
import DashboardDeleteModal from "../DashboardDeleteModal/DashboardDeleteModal";
import Table from "../Table/Table";
import { AiOutlineDelete } from "react-icons/ai";
import { setPaymentReceipt } from "../../redux/ducks/receiptSlice";

const PaymentReceiptDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentReceiptsList } = useSelector((state) => state.receipts);

  const [selectedPaymentReceipt, setSelectedPaymentReceipt] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // dispatch(getReceipt());
    (async () => {
      const data = await getAllPaymentReceipts();
      const filteredData = data?.filter((x) => !x.blackList);

      dispatch(setPaymentReceipt(filteredData));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (paymentReceiptsList?.length) {
      if (initialLoading) {
        filterItems(id);
        setInitialLoading(false);
      }
    }
  }, [paymentReceiptsList]);

  const filterItems = (id) => {
    const items = paymentReceiptsList?.filter((x) => x._id === id);
    setSelectedPaymentReceipt(items);
    generatePdf(items[0], "Payment Receipt");
  };

  const buttons = [
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-py-[5px] tw-h-8 tw-ml-7 tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(
          `/sales/receipts/edit-payment-receipt/${selectedPaymentReceipt[0]?._id}`
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
            params?.row?.id === selectedPaymentReceipt[0]?._id &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.number}
        </span>
      ),
    },
    {
      field: "balanceAmount",
      headerName: "BalanceAmount",
      width: 120,
      renderCell: (params) => (
        <span
          className={`${
            params?.row?.id === selectedPaymentReceipt[0]?._id &&
            "tw-text-[#8153E2]"
          }`}
        >
          {params?.row?.balanceAmount}
        </span>
      ),
    },
  ];

  const handleRowClick = (e) => {
    filterItems(e?.row?.id);
  };

  const handleDelete = async () => {
    setLoading(true);

    let data = await deletePaymentReceipt(selectedPaymentReceipt);

    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setPaymentReceipt(filteredData));

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
        title={"Delete Payment Receipt"}
        message={`PAY-${selectedPaymentReceipt[0]?.paymentReceipt}`}
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
          url={"/sales/receipts/add-new-payment-receipt"}
        />
      </div>

      <div className="tw-flex tw-gap-5 tw-bg-white tw-mt-14 tw-px-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          {paymentReceiptsList && (
            <Table
              columns={columns}
              rows={
                paymentReceiptsList?.length >= 0 &&
                paymentReceiptsList
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    number: "PAY-" + x.paymentReceipt,
                    balanceAmount:
                      "₹" +
                      (x.itemDetails?.total -
                        (x.itemDetails?.payed + x.itemDetails?.paying)),
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={paymentReceiptsList}
              dashboard={true}
            />
          )}
        </div>
        {selectedPaymentReceipt && (
          <>
            <div className="tw-w-full">
              <DashboardCommonSection
                number={"SLA-" + selectedPaymentReceipt[0]?.paymentReceipt}
                name={selectedPaymentReceipt[0]?.customer}
                buttons={buttons}
              />

              <div className="tw-px-6 tw-bg-[#EEE7FF] tw-rounded-xl tw-w-full z-0">
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
                          {console.log(selectedPaymentReceipt)}
                          {selectedPaymentReceipt[0]?.itemDetails?.itemDetails?.map(
                            (x, idx) => (
                              <tr>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {idx + 1}
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.name}
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  hi
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.quantity}
                                </td>
                                <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                  {x.rate}
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
                                  {x.quantity * x.rate}.00
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

export default PaymentReceiptDashboard;
