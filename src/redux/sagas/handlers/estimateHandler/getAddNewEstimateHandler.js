import { call, put } from "redux-saga/effects";
import { requestGetAddNewEstimate } from "../../requests/estimateRequest/getAddNewEstimateRequest";
import { setCustomer } from "../../../ducks/customerSlice";
import { setTax } from "../../../ducks/taxSlice";
import { setItem } from "../../../ducks/itemSlice";
import { setLastEst } from "../../../ducks/estimateSlice";
import { setCountryCode } from "../../../ducks/countrySlice";

export function* handleGetAddNewEstimate(action) {
  try {
    const {
      clients,
      items,
      taxes,
      profile: { countryCode },
      lastEst,
    } = yield call(requestGetAddNewEstimate);

    yield put(setCustomer(clients));
    yield put(setItem(items));
    yield put(setTax(taxes));
    yield put(setLastEst(lastEst));
    yield put(setCountryCode(countryCode));
  } catch (error) {
    console.log(error);
  }
}
