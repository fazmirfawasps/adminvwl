import { createSlice } from "@reduxjs/toolkit";

const paymentReceiptSlice = createSlice({
  name: "paymentReceipts",
  initialState: {
    paymentReceiptsList: [],
    lastPay: [],
  },
  reducers: {
    getPaymentReceipt() {},
    getAddNewPaymentReceipt() {},
    setPaymentReceipt(state, action) {
      const paymentReceiptsList = action.payload;
      return { ...state, paymentReceiptsList };
    },
    setLastPay(state, action) {
      const lastPay = action.payload;
      return { ...state, lastPay };
    },
  },
});

export const {
  getAddNewPaymentReceipt,
  getPaymentReceipt,
  setLastPay,
  setPaymentReceipt,
} = paymentReceiptSlice.actions;

export default paymentReceiptSlice.reducer;
