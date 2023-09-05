import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../DashboardNavbar/DashboardNavbar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import generatePdf from "../EstimateDashboard/PdfGenerator";
import DashboardCommonSection from "../DashboardCommonSection/DashboardCommonSection";
import { getAllBills } from "../../services/billServices";
import Table from "../Table/Table";
import { setBill } from "../../redux/ducks/billSlice";

const BillDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedBill, setSelectedBill] = useState([]);
  const { billsList } = useSelector((state) => state.bill);

  useEffect(() => {
    (async () => {
      const data = await getAllBills();
      dispatch(setBill(data));
    })();
  }, [dispatch]);

  useEffect(() => {
    if (billsList?.length) {
      filterItems(id);
    }
  }, [billsList]);

  const filterItems = (id) => {
    const items = billsList?.filter((x) => x._id === id);
    setSelectedBill(items);
    generatePdf(items[0], "Bill");
  };

  const buttons = [
    {
      buttonName: "Record payment",
      buttonStyles:
        "tw-px-3 tw-ml-7 tw-h-8 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-rounded-[5px] tw-border tw-cursor-pointer tw-bg-[#8153E2] tw-border-[#8153E2] tw-text-white",
      buttonFunction: () =>
        navigate(
          `/purchases/payment-receipts/add-new-payment-receipt/${selectedBill[0]?._id}`
        ),
    },
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-py-[5px] tw-h-8 tw-ml-7 tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(
          `/purchases/debit-notes/edit-debit-note/${selectedBill[0]?._id}`
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
            params?.row?.number === "BIL-" + selectedBill[0]?.bill &&
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
            params?.row?.amount === "₹" + selectedBill[0]?.total &&
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
          url={"/purchases/bills/add-new-bill"}
        />
      </div>

      <div className="tw-flex tw-gap-5 tw-bg-white tw-px-14 tw-mt-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          {billsList && (
            <Table
              columns={columns}
              rows={
                billsList?.length >= 0 &&
                billsList
                  .filter((x) => !x.blackList)
                  .map((x, idx) => ({
                    id: x._id,
                    number: "BIL-" + x.bill,
                    amount: "₹" + x.total,
                  }))
              }
              handleNavigation={handleRowClick}
              listOfItems={billsList}
              dashboard={true}
            />
          )}
        </div>
        {selectedBill && (
          <>
            <div className="tw-w-full">
              <DashboardCommonSection
                number={"BIL-" + selectedBill[0]?.bill}
                name={selectedBill[0]?.vendor}
                data={selectedBill}
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
                          {selectedBill[0]?.itemDetails?.map((x, idx) => (
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

export default BillDashboard;
