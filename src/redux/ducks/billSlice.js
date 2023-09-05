import { createSlice } from "@reduxjs/toolkit";

const BillSlice = createSlice({
  name: "bill",
  initialState: {
    billsList: [],
    lastBill: [],
  },
  reducers: {
    getBill() {},
    getAddNewBill() {},
    setBill(state, action) {
      const billsList = action.payload;
      return { ...state, billsList };
    },
    setLastBill(state, action) {
      const lastBill = action.payload;
      return { ...state, lastBill };
    },
  },
});

export const { getAddNewBill, getBill, setBill, setLastBill } =
  BillSlice.actions;

export default BillSlice.reducer;
