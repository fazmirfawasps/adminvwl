import { createSlice } from "@reduxjs/toolkit";

const estimateSlice = createSlice({
  name: "estimate",
  initialState: {
    estimatesList: [],
    lastEst: [],
    quotesList: [],
    lastQot: [],
  },
  reducers: {
    getEstimate() {},
    getAddNewEstimate() {},
    getQuote() {},
    getAddNewQuote() {},
    setEstimate(state, action) {
      const estimatesList = action.payload;
      return { ...state, estimatesList };
    },
    setLastEst(state, action) {
      const lastEst = action.payload;
      return { ...state, lastEst };
    },
    setQuote(state, action) {
      const quotesList = action.payload;
      return { ...state, quotesList };
    },
    setLastQot(state, action) {
      const lastQot = action.payload;
      return { ...state, lastQot };
    },
  },
});

export const {
  getEstimate,
  setEstimate,
  getAddNewEstimate,
  setLastEst,
  getAddNewQuote,
  getQuote,
  setQuote,
  setLastQot,
} = estimateSlice.actions;

export default estimateSlice.reducer;
