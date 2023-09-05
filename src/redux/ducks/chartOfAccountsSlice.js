import { createSlice } from "@reduxjs/toolkit";

const chartOfAccountsSlice = createSlice({
  name: "chartOfAccounts",
  initialState: {
    chartOfAccountList: [],
  },
  reducers: {
    getChartOfAccounts() {},
    setChartOfAccounts: (state, action) => {
      const chartOfAccountList = action.payload;
      return { ...state, chartOfAccountList };
    },
  },
});

export const { getChartOfAccounts, setChartOfAccounts } = chartOfAccountsSlice.actions;

export default chartOfAccountsSlice.reducer;
