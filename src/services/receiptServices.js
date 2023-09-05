import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const addNewPaymentReceipt = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/receipts/add-new-payment-receipt`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPaymentReceipts = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/receipts/get-all-payment-receipts`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewRefundReceipt = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/receipts/add-new-refund-receipt`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllRefundReceipts = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/receipts/get-all-refund-receipts`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewPaymentReceipt = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/receipts/get-new-payment-receipt`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewRefundReceipt = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/receipts/get-new-refund-receipt`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePaymentReceipt = async (paymentReceipt) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/receipts/delete-payment-receipt`,
      paymentReceipt,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRefundReceipt = async (refundReceipt) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/receipts/delete-refund-receipt`,
      refundReceipt,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editPaymentReceipt = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/receipts/edit-payment-receipt`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editRefundReceipt = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/receipts/edit-refund-receipt`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllPaymentReceipts = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/receipts/delete-all-payment-receipts`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllRefundReceipts = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/receipts/delete-all-refund-receipts`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
