import { createSlice } from "@reduxjs/toolkit"

const vendorSlice = createSlice({
    name: "vendor",
    initialState: {},
    reducers: {
        getVendor() {},
        setVendor(state, action) {
            const vendorsList = action.payload;
            return { ...state, vendorsList };
        }
    }
})

export const { getVendor, setVendor } = vendorSlice.actions;

export default vendorSlice.reducer;