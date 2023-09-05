import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

export const addNewPaymentReceipt = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/purchases/payment-receipts/add-new-payment-receipt`,
      formDataObj
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPaymentReceipts = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/payment-receipts/get-all-payment-receipts`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewPaymentReceipt = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/payment-receipts/get-new-payment-receipt`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePaymentReceipt = async (paymentReceipt) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/payment-receipts/delete-payment-receipt`,
      paymentReceipt
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editPaymentReceipt = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/payment-receipts/edit-payment-receipt`,
      formDataObj
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllPaymentReceipts = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/payment-receipts/delete-all-payment-receipts`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
