import { createSlice } from "@reduxjs/toolkit";

const GoodsReceiveNoteSlice = createSlice({
  name: "debitNote",
  initialState: {
    goodsReceiveNotesList: [],
    lastGrn: [],
  },
  reducers: {
    getGoodsReceiveNotes() {},
    getAddNewGoodsReceiveNotes() {},
    setGoodsReceiveNotes(state, action) {
      const goodsReceiveNotesList = action.payload;
      return { ...state, goodsReceiveNotesList };
    },
    setLastGrn(state, action) {
      const lastGrn = action.payload;
      return { ...state, lastGrn };
    },
  },
});

export const {
  getAddNewGoodsReceiveNotes,
  getGoodsReceiveNotes,
  setGoodsReceiveNotes,
  setLastGrn,
} = GoodsReceiveNoteSlice.actions;

export default GoodsReceiveNoteSlice.reducer;
