import { createSlice } from "@reduxjs/toolkit"

const invoiceSlice = createSlice({
    name: "invoice",
    initialState: {
        invoicesList: [],
        lastInv: []
    },
    reducers: {
        getInvoice() {},
        getAddNewInvoice() {},
        setInvoice(state, action) {
            const invoicesList = action.payload;
            return { ...state, invoicesList };
        },
        setLastInv(state, action) {
            const lastInv = action.payload;
            return { ...state, lastInv };
        }
    }
})

export const { getAddNewInvoice, getInvoice, setInvoice, setLastInv } = invoiceSlice.actions;

export default invoiceSlice.reducer;