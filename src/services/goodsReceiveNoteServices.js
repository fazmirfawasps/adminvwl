import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const getAddNewGoodsReceiveNote = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/goods-receive-note/get-new-goods-receive-note`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewGoodsReceiveNote = async (formDataObj) => {
  try {
    console.log("by");
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/purchases/goods-receive-note/add-new-goods-receive-note`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllGoodsReceiveNote = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/goods-receive-note/get-all-goods-receive-note`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteGoodsReceiveNote = async (goodsReceiveNote) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/goods-receive-note/delete-goods-receive-note`,
      goodsReceiveNote,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editGoodsReceiveNote = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/goods-receive-note/edit-goods-receive-note`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllGoodsReceiveNotes = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/goods-receive-note/delete-all-goods-receive-note`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
