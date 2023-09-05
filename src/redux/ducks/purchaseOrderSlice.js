import { createSlice } from "@reduxjs/toolkit"

const purchaseOrder = createSlice({
    name: "purchaseOrder",
    initialState: {
        purchaseOrdersList: [],
        lastPso: []
    },
    reducers: {
        getPurchaseOrder() {},
        getAddNewPurchaseOrder() {},
        setPurchaseOrder(state, action) {
            const purchaseOrdersList = action.payload;
            return { ...state, purchaseOrdersList };
        },
        setLastPso(state, action) {
            const lastPso = action.payload;
            return { ...state, lastPso };
        }
    }
})

export const { getAddNewPurchaseOrder, getPurchaseOrder, setPurchaseOrder, setLastPso } = purchaseOrder.actions;

export default purchaseOrder.reducer;