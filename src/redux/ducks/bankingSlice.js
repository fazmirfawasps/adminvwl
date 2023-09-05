import { createSlice } from "@reduxjs/toolkit";

const bankingSlice = createSlice({
  name: "banking",
  initialState: {
    banksList: [],
    bankExpenseList: [],
    pettyCashExpenseList: [],
  },
  reducers: {
    getBanking() {},
    getAddNewTransaction() {},
    setBanking(state, action) {
      const { banksList, bankExpenseList, pettyCashExpenseList } =
        action.payload;
      return { ...state, banksList, bankExpenseList, pettyCashExpenseList };
    },
    setBanks(state, action) {
      const { banksList } = action.payload;
      return { ...state, banksList };
    },
    setExpense(state, action) {
      const { bankExpenseList, pettyCashExpenseList } = action.payload;
      return { ...state, bankExpenseList, pettyCashExpenseList };
    },
  },
});

export const {
  getAddNewTransaction,
  getBanking,
  setBanking,
  setBanks,
  setExpense,
} = bankingSlice.actions;

export default bankingSlice.reducer;
