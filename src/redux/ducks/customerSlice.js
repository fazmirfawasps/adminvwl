import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customersList: [],
  },
  reducers: {
    getCustomer() {},
    setCustomer(state, action) {
      const customersList = action.payload;
      return { ...state, customersList };
    },
  },
});

export const { getCustomer, setCustomer } = customerSlice.actions;

export default customerSlice.reducer;
