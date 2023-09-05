import { call, put } from "redux-saga/effects";
import { setAdmin } from "../../../ducks/adminSlice";
import { requestGetAdmin } from "../../requests/adminRequest/getAdminRequest";

export function* handleAdmin(action) {
    try{
        const data  = yield call (requestGetAdmin);
        yield put(setAdmin({ ...data }));
    }
    catch(error) {
        console.log(error)
    }
}