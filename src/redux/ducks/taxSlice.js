import { createSlice } from "@reduxjs/toolkit"

const taxSlice = createSlice({
    name: "tax",
    initialState: {},
    reducers: {
        getTax() {},
        setTax(state, action) {
            const taxes = action.payload;
            return { ...state, taxes };
        }
    }
})

export const { getTax, setTax } = taxSlice.actions;

export default taxSlice.reducer;