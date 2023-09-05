import { call, put } from "redux-saga/effects";
import { setEstimate } from "../../../ducks/estimateSlice";
import { requestGetAllEstimate } from "../../requests/estimateRequest/getAllEstimateRequest";

export function* handleGetAllEstimate(action) {
  try {
    const data = yield call(requestGetAllEstimate);
    const filteredData = data?.filter((x) => !x.blackList);
    yield put(setEstimate(filteredData));
  } catch (error) {
    console.log(error);
  }
}
