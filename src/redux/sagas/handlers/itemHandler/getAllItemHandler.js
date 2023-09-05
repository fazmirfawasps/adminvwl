import { call, put } from "redux-saga/effects";
import { setItem } from "../../../ducks/itemSlice";
import { requestGetAllItem } from "../../requests/itemRequests/getAllItemRequest";

export function* handleGetAllItem(action) {
    try{
        const data  = yield call (requestGetAllItem);
        yield put(setItem({ ...data }));
    }
    catch(error) {
        console.log(error)
    }
}