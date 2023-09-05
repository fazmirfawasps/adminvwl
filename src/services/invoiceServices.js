import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const getAddNewInvoice = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/invoices/get-new-invoice`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewInvoice = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/invoices/new-invoice`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllInvoice = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/invoices/get-all-invoices`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteInvoice = async (invoicesList) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/invoices/delete-invoice`,
      invoicesList,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteAllInvoices = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/invoices/delete-all-invoices`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editInvoice = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/invoices/edit-invoice`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
