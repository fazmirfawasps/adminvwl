import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEstimate, setEstimate } from "../../redux/ducks/estimateSlice";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import generatePdf from "./PdfGenerator";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import Table from "../Table/Table";
import {
  changeEstimateStatus,
  convertToInvoice,
  deleteEstimate,
} from "../../services/estimateServices";
import DashboardDeleteModal from "../DashboardDeleteModal/DashboardDeleteModal";

const EstimateDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialLoading = useRef({ loading: true });
  const { estimatesList } = useSelector((state) => state.estimates);

  const [selectedEstimate, setSelectedEstimate] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getEstimate());
  }, [dispatch]);

  useEffect(() => {
    if (estimatesList?.length) {
      if (initialLoading.current.loading) {
        filterItems(id);
        initialLoading.current.loading = false;
      }
    }
  }, [estimatesList]);

  useEffect(() => {
    if (estimatesList?.length) {
      filterItems(id);
    }
  }, [id]);

  const filterItems = (id) => {
    const items = estimatesList?.filter((x) => x._id === id);
    setSelectedEstimate(items);

    const { estimate, estimateDate } = items[0];
    generatePdf(items[0], "Estimate", `EST-${estimate}`, estimateDate, "sales");
  };

  const handleConvertToInvoice = async () => {
    if (selectedEstimate?.length) {
      if (
        selectedEstimate[0]?.convertedToInvoice ||
        selectedEstimate[0]?.status !== "Accepted"
      ) {
        return;
      }
      const data = { data: selectedEstimate[0], type: "estimate" };
      const updatedDoc = await convertToInvoice(data);

      if (updatedDoc) {
        const newEstimatesList = estimatesList.map((x) => {
          if (x._id === updatedDoc._id) return updatedDoc;
          return x;
        });
        initialLoading.current.loading = true;
        dispatch(setEstimate(newEstimatesList));
      }
    }
  };

  const buttons = [
    {
      buttonName: "Convert to invoice",
      buttonStyles: `tw-px-3 tw-ml-7 tw-h-8 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-rounded-[5px] tw-border ${
        selectedEstimate[0]?.convertedToInvoice ||
        selectedEstimate[0]?.status !== "Accepted"
          ? "tw-cursor-not-allowed tw-bg-[#795abb] tw-border-[#795abb] tw-text-[#EEE7FF]"
          : "tw-cursor-pointer tw-bg-[#8153E2] tw-border-[#8153E2] tw-text-white"
      }`,
      buttonFunction:
        selectedEstimate[0]?.convertedToInvoice ||
        selectedEstimate[0]?.status !== "Accepted"
          ? null
          : handleConvertToInvoice,
    },
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-ml-7 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(`/sales/estimates/edit-estimate/${selectedEstimate[0]?._id}`),
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
            params?.row?.id === selectedEstimate[0]?._id && "tw-text-[#8153E2]"
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
            params?.row?.id === selectedEstimate[0]?._id && "tw-text-[#8153E2]"
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

    // delete estimates
    data = await deleteEstimate(selectedEstimate);
    const filteredData = data?.filter((x) => !x.blackList);
    dispatch(setEstimate(filteredData));

    if (filteredData?.length) {
      filterItems(filteredData[0]?._id);
    } else {
      navigate("/sales/estimates");
    }

    setLoading(false);
    setOpen(false);
  };

  const handleChangeStatus = async (e) => {
    try {
      const status = e.target.value;
      const { _id } = selectedEstimate[0];

      const data = await changeEstimateStatus({ _id, status });

      if (data) setSelectedEstimate([data]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* modal starting for confirmation */}
      <DashboardDeleteModal
        title={"Delete Estimate"}
        message={`EST-${selectedEstimate[0]?.estimate}`}
        handleDelete={handleDelete}
        loading={loading}
        open={open}
        onClose={(e) => setOpen(false)}
      />
      {/* modal ending for confirmation */}
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          rounded={true}
          url={"/sales/estimates/add-new-estimate"}
        />
      </div>

      <div className="tw-flex tw-gap-5 tw-bg-white tw-px-14 tw-mt-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          {estimatesList && (
            <Table
              columns={columns}
              rows={
                estimatesList?.length >= 0 &&
                estimatesList
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    number: "EST-" + x.estimate,
                    amount: "₹" + x.total,
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={estimatesList}
              dashboard={true}
            />
          )}
        </div>
        {selectedEstimate && (
          <>
            <div className="tw-w-full">
              <DashboardCommonSection
                number={"EST-" + selectedEstimate[0]?.estimate}
                name={selectedEstimate[0]?.customer}
                buttons={buttons}
                statusInput={{
                  value: selectedEstimate[0]?.status
                    ? selectedEstimate[0].status
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
                          {selectedEstimate[0]?.itemDetails?.map((x, idx) => (
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
                          ))}
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

export default EstimateDashboard;
