import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const getAddNewBill = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/bills/get-new-bill`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewBill = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/purchases/bills/add-new-bill`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBills = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/bills/get-all-bills`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBill = async (debitNote) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/bills/delete-bill`,
      debitNote,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editBill = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/bills/edit-bill`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllBills = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/bills/delete-all-bills`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
