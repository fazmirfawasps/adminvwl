import { createSlice } from "@reduxjs/toolkit";

const receiptSlice = createSlice({
  name: "receipt",
  initialState: {
    paymentReceiptsList: [],
    lastPay: [],
    refundReceiptsList: [],
    lastRet: [],
  },
  reducers: {
    getPaymentReceipt() {},
    getAddNewPaymentReceipt() {},
    getRefundReceipt() {},
    getAddNewRefundReceipt() {},
    setPaymentReceipt(state, action) {
      const paymentReceiptsList = action.payload;
      return { ...state, paymentReceiptsList };
    },
    setRefundReceipt(state, action) {
      const refundReceiptsList = action.payload;
      return { ...state, refundReceiptsList };
    },
    setLastPay(state, action) {
      const lastPay = action.payload;
      return { ...state, lastPay };
    },
    setLastRet(state, action) {
      const lastRet = action.payload;
      return { ...state, lastRet };
    },
  },
});

export const {
  getPaymentReceipt,
  setPaymentReceipt,
  getRefundReceipt,
  setRefundReceipt,
  setLastPay,
  setLastRet,
  getAddNewPaymentReceipt,
  getAddNewRefundReceipt,
} = receiptSlice.actions;

export default receiptSlice.reducer;
