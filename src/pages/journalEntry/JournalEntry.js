import React, { useEffect, useState } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar'
import Table from '../../components/Table/Table';
import { getJournal } from '../../services/journalEntryService';
import { useNavigate } from 'react-router-dom';
import { setJouranlEntrys } from '../../redux/ducks/journalEntrySlice';
import {useSelector,useDispatch} from 'react-redux'

const JournalEntry = () => {
  const columns = [
    { field: "date", headerName: "Date", width: 150 ,
    // renderCell: (params) => (
    //   <div
    //     onClick={() => handleDateClick(params.row.id)} // Add onClick event handler
    //     style={{ cursor: "pointer" }}
    //   >
    //     {params.value}
    //   </div>
    // ),
    renderCell: (params) => {
      const formattedDate = new Date(params?.row?.date).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      );
      return <div>{formattedDate}</div>;
    },
  },
    { field: "journal", headerName: "Journal", width: 180 },
    {
      field: "reference",
      headerName: "Reference",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 130,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      width: 150,
    },
    {
      field: "notes",
      headerName: "Notes",
      type: "number",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 150,
    },
  ];
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {journalEntryList}=useSelector((state)=>state.journalEntrys)
  console.log(journalEntryList,'the list');
  const [data, setData] = useState([])
  const handleDateClick = (journalId) => {
  navigate(`/jounral-entry-dashboard/${journalId}`);
};


  const fetchJournal = async () => {
    const  {data}  = await getJournal()
    dispatch((setJouranlEntrys(data.data)))
    setData(data.data)
  }
  useEffect(() => {
    try {
      fetchJournal()
    } catch (error) {
      console.log(error);

    }
  }, [])
  return (
    <>
      <div className="dashboard tw-mt-16 tw-bg-white">
        <DashboardNavbar rounded={true} url={"/accounting/add-new-journal"} />
      </div>
      <div className="tw-px-14 tw-h-[80vh] tw-bg-white">
        <Table
          columns={columns}
          rows={journalEntryList.map((journal) => ({
            id: journal?._id,
            date: journal?.date,
            journal:journal?.journal,
            reference:journal?.referenceNumber,
            status:journal?.journalStatus,
            notes:journal?.journalNotes,
            amount:journal?.amount
          }))}
        />
      </div>

    </>
  )
}

export default JournalEntry