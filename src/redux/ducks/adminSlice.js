import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminId: "",
    adminEmail: "",
    isLoggedIn: false,
  },
  reducers: {
    getAdmin() {},
    setAdmin: (state, action) => {
      state.adminId = action.payload.id;
      state.adminEmail = action.payload.email;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    setAdminLogOut: (state, action) => {
      state.adminId = null;
      state.adminEmail = null;
      state.isLoggedIn = false;
    },
  },
});

export const { getAdmin, setAdmin, setAdminLogOut } = adminSlice.actions;

export default adminSlice.reducer;
