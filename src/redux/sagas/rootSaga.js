import { takeLatest, fork, all } from "redux-saga/effects";
import { getCustomer } from "../ducks/customerSlice";
import { getEstimate, getAddNewEstimate } from "../ducks/estimateSlice";
import { getSalesOrder } from "../ducks/salesOrderSlice";
import { handleGetAllCustomer } from "./handlers/customerHandler/getAllCustomerHandler";
import { handleGetAllEstimate } from "./handlers/estimateHandler/getAllEstimateHandler";
import { handleGetAddNewEstimate } from "./handlers/estimateHandler/getAddNewEstimateHandler";
import { handleGetAllItem } from "./handlers/itemHandler/getAllItemHandler";
import { getItem } from "../ducks/itemSlice";
import { handleGetAllSalesOrder } from "./handlers/salesOrderHandler/getAllSalesOrderHandler";
import { getAdmin } from "../ducks/adminSlice";
import { handleAdmin } from "./handlers/adminHandler/getAdminHandler";

export function* watchLoginAdmin() {
  yield takeLatest(getAdmin, handleAdmin);
}

export function* watchGetAllCustomer() {
  yield takeLatest(getCustomer, handleGetAllCustomer);
}

export function* watchGetAllItem() {
  yield takeLatest(getItem, handleGetAllItem);
}

export function* watchGetAddNewEstimate() {
  yield takeLatest(getAddNewEstimate, handleGetAddNewEstimate);
}

export function* watchGetAllEstimate() {
  yield takeLatest(getEstimate, handleGetAllEstimate);
}

export function* watchGetAllSalesOrder() {
  yield takeLatest(getSalesOrder, handleGetAllSalesOrder);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAllCustomer),
    fork(watchGetAllItem),
    fork(watchGetAddNewEstimate),
    fork(watchGetAllEstimate),
    fork(watchGetAllSalesOrder),
  ]);
}
