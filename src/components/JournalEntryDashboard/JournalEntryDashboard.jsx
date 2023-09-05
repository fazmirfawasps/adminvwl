import React, { useEffect, useState } from 'react'
import DashboardNavbar from '../DashboardNavbar/DashboardNavbar';
import Table from '../Table/Table';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJournal } from '../../services/journalEntryService';
import { setJouranlEntrys } from '../../redux/ducks/journalEntrySlice';
import DashboardCommonSection from '../DashboardCommonSection/DashboardCommonSection';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { FiMoreHorizontal } from 'react-icons/fi';

const JournalEntryDashboard = () => {
  const { id } = useParams()
  // console.log(id,'iddd in dashboad');
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { journalEntryList } = useSelector((state) => state.journalEntrys)
  const [selectedItem, setSelectedItem] = useState([]);
  console.log(selectedItem, 'selected');

  console.log('here');
  const columns = [

    {
      field: "number", headerName: "Number", width: 120,
      renderCell: (params) => (
        <span
          className={`tw-px-3 ${params?.row?.number === selectedItem[0]?.referenceNumber &&
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
      type: "number",
      width: 120,
    },
  ]
  const fetchJournal = async () => {
    const { data } = await getJournal()
    dispatch((setJouranlEntrys(data.data)))
    // setData(data.data)
  }


  useEffect(() => {
    journalEntryList && filterItems(id);
  }, [journalEntryList]);

  useEffect(() => {
    fetchJournal()
  }, [])
  const filterItems = (id) => {
    setSelectedItem(journalEntryList.filter((items) => items._id === id));
  };
  const handleRowClick = (e) => {
    filterItems(e?.row?.id)
  }
  const buttons = [
    {
      buttonName: "Convert to invoice",
      buttonStyles:
        "tw-px-3 tw-h-8 tw-py-1 tw-text-xs tw-font-medium tw-text-center tw-text-white tw-bg-[#8153E2] tw-rounded-[5px] tw-border tw-border-[#8153E2]",
      buttonFunction: null,
    },
    {
      buttonName: <MdOutlineModeEditOutline />,
      buttonStyles:
        "tw-px-3 tw-h-8 tw-ml-7 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-[#EEE7FF] tw-rounded-[5px]",
      buttonFunction: () =>
        navigate(`/accounting/add-new-journal/${selectedItem[0]?._id}`),
    },
    {
      buttonName: <FiMoreHorizontal />,
      buttonStyles:
        "tw-relative tw-h-8 tw-ml-7 tw-px-3 tw-py-[5px] tw-text-center tw-text-[#8153E2] tw-bg-white tw-rounded-[5px] tw-shadow-lg",
      buttonFunction: null,
    },
  ];
  return (
    <>
      <div className="tw-mt-16">
        <DashboardNavbar
          backButton={true}
          dashboard={true}
          rounded={true}
          url={"/accounting/add-new-journal"}
        />
      </div>
      <div className="tw-flex tw-gap-5 tw-bg-white tw-px-14 tw-mt-14">
        <div className="tw-min-w-[35%] tw-mt-2">
          <Table
            columns={columns}
            rows={journalEntryList.map((journals) => ({
              id: journals?._id,
              number: journals?.referenceNumber,
              amount: journals?.firstExpenseDebitAmount
            }))}
            dashboard={true}
            handleNavigation={handleRowClick}
            listOfItems={journalEntryList}
          />
        </div>

        <div className="tw-w-full">
          <DashboardCommonSection
            number={"EST-" + selectedItem[0]?.referenceNumber}
            name={selectedItem[0]?.firstExpenseDebitAmount}
            buttons={buttons}
          />
          <div className="tw-px-6 tw-py-6 tw-bg-[#EEE7FF] tw-rounded-xl tw-w-full z-0">
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
                          {selectedItem.map((x, idx) => (
                            <tr>
                              <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                {/* {idx + 1} */}
                              </td>
                              <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                {/* {x.itemName} */}
                              </td>
                              <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                hi
                              </td>
                              <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                {/* {x.primaryUnitQuantity} */}
                              </td>
                              <td className="tw-border-x tw-border-b tw-border-[#b3adc0] tw-font-thin tw-text-xs">
                                {/* {x.retailPrice} */}
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
                                {/* {x.primaryUnitQuantity * x.retailPrice}.00 */}
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
  )
}

export default JournalEntryDashboard