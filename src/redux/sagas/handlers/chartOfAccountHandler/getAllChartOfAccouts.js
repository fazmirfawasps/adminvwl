import { call, put } from "redux-saga/effects";
import { requestGetAllChartOfAccounts } from "../../requests/chartOfAccountsRequest/getAllChartOfAccountsRequest";
import { setChartOfAccounts } from "../../../ducks/chartOfAccountsSlice";
export function* handleGetAllChartOfAccounts() {
    try{
        const data  = yield call (requestGetAllChartOfAccounts);
        yield put(setChartOfAccounts(data));

    }
    catch(error) {
        console.log(error)
    }
}