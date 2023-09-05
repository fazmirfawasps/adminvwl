import { call, put } from "redux-saga/effects";
import { setCustomer } from "../../../ducks/customerSlice";
import { requestGetAllCustomer } from "../../requests/customerRequest/getAllCustomerRequest";

export function* handleGetAllCustomer(action) {
  try {
    const data = yield call(requestGetAllCustomer);
    console.log(data,'data inside the redux');
    yield put(setCustomer({ ...data }));
  } catch (error) {
    console.log(error);
  }
}
