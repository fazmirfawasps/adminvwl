import { call, put } from "redux-saga/effects";
import { setSalesOrder } from "../../../ducks/salesOrderSlice";
import { requestGetAllSalesOrder } from "../../requests/salesOrderRequest/getAllSalesOrderRequest";

export function* handleGetAllSalesOrder(action) {
  try {
    const data = yield call(requestGetAllSalesOrder);
    const filteredData = data?.filter((x) => !x.blackList);
    yield put(setSalesOrder(filteredData));
  } catch (error) {
    console.log(error);
  }
}
