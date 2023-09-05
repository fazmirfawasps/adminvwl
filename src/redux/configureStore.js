import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas/rootSaga";
import customerReducer from "./ducks/customerSlice";
import estimateReducer from "./ducks/estimateSlice";
import invoiceReducer from "./ducks/invoiceSlice";
import itemReducer from "./ducks/itemSlice";
import salesOrderReducer from "./ducks/salesOrderSlice";
import receiptsReducer from "./ducks/receiptSlice";
import taxesReducer from "./ducks/taxSlice";
import adminReducer from "./ducks/adminSlice";
import vendorReducer from "./ducks/vendorSlice";
import purchaseReducer from "./ducks/purchaseOrderSlice";
import billReducer from "./ducks/billSlice";
import paymentReceiptsReducer from "./ducks/paymentReceiptsSlice";
import goodsReceiveNoteReducer from "./ducks/goodsReceiveNoteSlice";
import countryReducer from "./ducks/countrySlice";
import bankingReducer from "./ducks/bankingSlice";
import chartOfAccountReducer from "./ducks/chartOfAccountsSlice";
import jouranlEntryReducer from "./ducks/journalEntrySlice";

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  customers: customerReducer,
  estimates: estimateReducer,
  invoices: invoiceReducer,
  items: itemReducer,
  salesOrders: salesOrderReducer,
  receipts: receiptsReducer,
  taxes: taxesReducer,
  admin: adminReducer,
  vendors: vendorReducer,
  purchaseOrders: purchaseReducer,
  bill: billReducer,
  paymentReceipts: paymentReceiptsReducer,
  goodsReceiveNotes: goodsReceiveNoteReducer,
  country: countryReducer,
  banking: bankingReducer,
  chartOfAccounts: chartOfAccountReducer,
  journalEntrys: jouranlEntryReducer,
});

const store = configureStore({
  reducer,
  middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
