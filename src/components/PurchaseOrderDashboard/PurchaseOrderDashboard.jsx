import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import generatePdf from "../EstimateDashboard/PdfGenerator";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import {
  changePurchaseOrderStatus,
  convertToBill,
  deletePurchaseOrder,
  getAllPurchaseOrder,
} from "../../services/purchaseOrderServices";
import { setPurchaseOrder } from "../../redux/ducks/purchaseOrderSlice";
import Table from "../Table/Table";
import { AiOutlineDelete } from "react-icons/ai";
import DashboardDeleteModal from "../DashboardDeleteModal/DashboardDeleteModal";

const PurchaseOrderDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialLoading = useRef({ loading: true });
  const { purchaseOrdersList } = useSelector((state) => state.purchaseOrders);

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getAllPurchaseOrder();
      const filteredData = data?.filter((x) => !x.blackList);
      dispatch(setPurchaseOrder(filteredData));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (purchaseOrdersList?.length) {
      if (initialLoading.current.loading) {
        filterItems(id);
        initialLoading.current.loading = false;
      }
    }
  }, [purchaseOrdersList]);

  useEffect(() => {
    if (purchaseOrdersList?.length) {
      filterItems(id);
    }
  }, [id]);

  const filterItems = (id) => {
    const items = purchaseOrdersList?.filter((x) => x._id === id);
    setSelectedPurchaseOrder(items);

    const { purchaseOrder, purchaseOrderDate } = items[0];
    generatePdf(
      items[0],
      "Purchase Order",
      `PSO-${purchaseOrder}`,
      purchaseOrderDate,
      "purchases"
    );
  };

  const handleConvertToBill = async () => {
    if (selectedPurchaseOrder?.length) {
      if (
        selectedPurchaseOrder[0]?.convertedToBill ||
        selectedPurchaseOrder[0]?.status !== "Accepted"
      ) {
        return;
      }
      const updatedDoc = await convertToBill(selectedPurchaseOrder[0]);

      if (updatedDoc) {
        const newPsoList = purchaseOrdersList.map((x) => {
          if (x._id === updatedDoc._id) return updatedDoc;
          return x;
        });
        initialLoading.current.loading = true;
        dispatch(setPurchaseOrder(newPsoList));
      }
    }
  };

  const buttons = [
    {
      buttonName: "Convert to bill",
      buttonStyles: `tw-px-3 tw-ml-7 tw-h-8 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-rounded-[5px] tw-border ${
        selectedPurchaseOrder[0]?.convertedToBill ||
        selectedPurchaseOrder[0]?.status !== "Accepted"
          ? "tw-cursor-not-allowed tw-bg-[#795abb] tw-border-[#795abb] tw-text-[#EEE7FF]"
          : "tw-cursor-pointer tw-bg-[#8153E2] tw-border-[#8153E2] tw-text-white"
      }`,
      buttonFunction:
        selectedPurchaseOrder[0]?.convertedToBill ||
        selectedPurchaseOrder[0]?.status !== "Accepted"
          ? null
          : handleConvertToBill,
    },
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-py-[5px] tw-ml-7 tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(
          `/purchases/purchase-orders/edit-purchase-order/${selectedPurchaseOrder[0]?._id}`
        ),
    },
    {
      buttonName: <AiOutlineDelete />,
      buttonStyles:
        "tw-relative tw-h-8 tw-ml-7 tw-px-3 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
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
              "PSO-" + selectedPurchaseOrder[0]?.purchaseOrder &&
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
            params?.row?.amount === "₹" + selectedPurchaseOrder[0]?.total &&
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
    let data;

    // delete PurchaseOrder
    data = await deletePurchaseOrder(selectedPurchaseOrder);
    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setPurchaseOrder(filteredData));

    if (filteredData?.length) {
      filterItems(filteredData[0]?._id);
    } else {
      navigate("/purchases/purchase-orders");
    }

    setLoading(false);
    setOpen(false);
  };

  const handleChangeStatus = async (e) => {
    try {
      const status = e.target.value;
      const { _id } = selectedPurchaseOrder[0];

      const data = await changePurchaseOrderStatus({ _id, status });

      if (data) setSelectedPurchaseOrder([data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* modal starting for confirmation */}
      <DashboardDeleteModal
        title={"Delete Purchase Order"}
        message={`PSO-${selectedPurchaseOrder[0]?.purchaseOrder}`}
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
          url={"/purchases/purchase-orders/add-new-purchase-order"}
        />
      </div>

      <div className="tw-flex tw-gap-5 tw-bg-white tw-mt-14 tw-px-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          {purchaseOrdersList && (
            <Table
              columns={columns}
              rows={
                purchaseOrdersList?.length >= 0 &&
                purchaseOrdersList
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    number: "PSO-" + x.purchaseOrder,
                    amount: "₹" + x.total,
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={purchaseOrdersList}
              dashboard={true}
            />
          )}
        </div>
        {selectedPurchaseOrder && (
          <>
            <div className="tw-w-full">
              <DashboardCommonSection
                number={"PSO-" + selectedPurchaseOrder[0]?.purchaseOrder}
                name={selectedPurchaseOrder[0]?.vendor}
                data={selectedPurchaseOrder}
                buttons={buttons}
                statusInput={{
                  value: selectedPurchaseOrder[0]?.status
                    ? selectedPurchaseOrder[0].status
                    : "",
                  method: handleChangeStatus,
                }}
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
                          {selectedPurchaseOrder[0]?.itemDetails?.map(
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

export default PurchaseOrderDashboard;
