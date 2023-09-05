import { createSlice } from "@reduxjs/toolkit";

const salesOrderSlice = createSlice({
  name: "salesOrder",
  initialState: {
    salesOrderList: [],
    lastSlo: [],
  },
  reducers: {
    getSalesOrder() {},
    getAddNewSalesOrder() {},
    setSalesOrder(state, action) {
      const salesOrderList = action.payload;
      return { ...state, salesOrderList };
    },
    setLastSlo(state, action) {
      const lastSlo = action.payload;
      return { ...state, lastSlo };
    },
  },
});

export const { getSalesOrder, setSalesOrder, getAddNewSalesOrder, setLastSlo } =
  salesOrderSlice.actions;

export default salesOrderSlice.reducer;
