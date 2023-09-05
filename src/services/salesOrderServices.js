import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const addNewSalesOrder = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/sales-orders/add-new-sales-order`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllSalesOrder = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/sales-orders/get-all-sales-order`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewSalesOrder = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/sales-orders/get-new-sales-order`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSalesOrder = async (salesOrder) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/sales-orders/delete-sales-order`,
      salesOrder,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editSalesOrder = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/sales-orders/edit-sales-order`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllSalesOrders = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/sales-orders/delete-all-sales-orders`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
