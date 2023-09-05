import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import generatePdf from "../EstimateDashboard/PdfGenerator";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import { getAllGoodsReceiveNote } from "../../services/goodsReceiveNoteServices";
import Table from "../Table/Table";

const GoodsReceiveNoteDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedGoodsReceiveNote, setSelectedGoodsReceiveNote] = useState([]);
  const [goodsReceiveNote, setGoodsReceiveNote] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getAllGoodsReceiveNote();
      const filteredData = data?.filter((x) => !x.blackList);
      setGoodsReceiveNote(filteredData);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (goodsReceiveNote?.length) {
      filterItems(id);
    }
  }, [goodsReceiveNote]);

  const filterItems = (id) => {
    const items = goodsReceiveNote?.filter((x) => x._id === id);
    setSelectedGoodsReceiveNote(items);
    generatePdf(items[0], "GoodsReceiveNote");
  };

  const buttons = [
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-py-[5px] tw-h-8 tw-ml-7 tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(
          `/purchases/goods-receive-notes/edit-goods-receive-note/${selectedGoodsReceiveNote[0]?._id}`
        ),
    },
    {
      buttonName: <FiMoreHorizontal />,
      buttonStyles:
        "tw-relative tw-px-3 tw-h-8 tw-ml-7 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
      buttonFunction: null,
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
              "GRN-" + selectedGoodsReceiveNote[0]?.goodsReceiveNote &&
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
            params?.row?.amount === "₹" + selectedGoodsReceiveNote[0]?.total &&
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
  return (
    <>
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          dashboard={true}
          rounded={true}
          url={"/purchases/goods-receive-notes/add-new-goods-receive-note"}
        />
      </div>

      <div className="tw-flex tw-gap-5 tw-bg-white tw-px-14 tw-mt-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          {goodsReceiveNote && (
            <Table
              columns={columns}
              rows={
                goodsReceiveNote?.length >= 0 &&
                goodsReceiveNote
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    number: "GRN-" + x.goodsReceiveNote,
                    amount: "₹" + x.total,
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={goodsReceiveNote}
              dashboard={true}
            />
          )}
        </div>
        {selectedGoodsReceiveNote && (
          <>
            <div className="tw-w-full">
              <DashboardCommonSection
                number={"GRN-" + selectedGoodsReceiveNote[0]?.goodsReceiveNote}
                name={selectedGoodsReceiveNote[0]?.vendor}
                data={selectedGoodsReceiveNote}
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
                          {selectedGoodsReceiveNote[0]?.itemDetails?.map(
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

export default GoodsReceiveNoteDashboard;
