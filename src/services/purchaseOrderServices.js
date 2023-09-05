import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const getAddNewPurchaseOrder = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/get-new-purchase-order`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewPurchaseOrder = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/add-new-purchase-order`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchaseOrder = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/get-all-purchase-order`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePurchaseOrder = async (purchaseOrder) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/delete-purchase-order`,
      purchaseOrder,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editPurchaseOrder = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/edit-purchase-order`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllPurchaseOrders = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/delete-all-purchase-orders`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const convertToBill = async (formData) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/convert-to-bill`,
      formData,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const changePurchaseOrderStatus = async (values) => {
  try {
    const { data } = await axios.patch(
      `${REACT_APP_BACKEND_URL}/purchases/purchase-orders/change-purchase-order-status`,
      values,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
