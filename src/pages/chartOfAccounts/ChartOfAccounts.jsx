import React, { useEffect, useState } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar/DashboardNavbar';
import Table from '../../components/Table/Table';
import { useSelector,useDispatch } from 'react-redux';
// import { getChartOfAccounts } from '../../redux/ducks/chartOfAccountsSlice';
import {getChartOfAccounts} from '../../services/journalEntryService'
import { setChartOfAccounts } from '../../redux/ducks/chartOfAccountsSlice';

const ChartOfAccounts = () => {
  const dispatch = useDispatch();
  const [data,setData]=useState([])
  const {chartOfAccountList}=useSelector((state)=>state.chartOfAccounts)
  // console.log(chartOfAccountList,'from the api');
  const columns = [
    { field: "accountName", headerName: "Account Name", width: 150 },
    { field: "description", headerName: "Description", width: 180 },
    {
      field: "accountType",
      headerName: "Account Type",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 130,
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      type: "number",
      width: 150,
    },
    {
      field: "currency",
      headerName: "Currency",
      type: "number",
      width: 150,
    },
  ];
  const fetchChartOfAccounts=async ()=>{
    try {
      const {data}=await getChartOfAccounts()
      // console.log(data,'dataaaaaaaaaaaaaaaaaaaaaaaaaaa');
      dispatch(setChartOfAccounts(data))
      
      
    } catch (error) {
      console.log(error);
    }
  }
  // useEffect(() => {
  //   console.log('useEffect');
  //   dispatch(getChartOfAccounts());
  //   console.log('after');
  // }, [dispatch]);
  useEffect(()=>{
    fetchChartOfAccounts()
  },[])

  return (
    <>
      <div className="dashboard tw-mt-16 tw-bg-white">
        <DashboardNavbar rounded={true} />
      </div>
      <div className="tw-px-14 tw-h-[80vh] tw-bg-white">
        <Table
          columns={columns}
          rows={chartOfAccountList?.map((accountData) => ({
            id: accountData?._id,
            accountName: accountData?.bankName,
            description: accountData?.accountDescription,
            accountType: accountData?.accountType,
            accountNumber: accountData?.accountNumber,
            currency: accountData?.currency,
          }))}
          dashboard={false}
        />
      </div>
    </>
  );
};

export default ChartOfAccounts;
