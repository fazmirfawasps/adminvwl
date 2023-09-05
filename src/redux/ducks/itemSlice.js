import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    data: [],
    itemCounts: [],
  },
  reducers: {
    getItem() {},
    setItem: (state, action) => {
      console.log(action.payload.data, "inside slice");
      const data = action.payload.data;
      const itemCounts = action.payload.itemCounts;

      return { ...state, data, itemCounts };
    },
  },
});

export const { getItem, setItem } = itemSlice.actions;

export default itemSlice.reducer;
