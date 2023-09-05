import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const addNewVendor = async (formDataObj, vendorId) => {
  try {
    const data = await axios.post(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/add-new-vendor?id=${vendorId}&folderName=Vendors`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllVendors = async () => {
  try {
    const data = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/get-all-vendors`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOneVendor = async (vendorId) => {
  try {
    const data = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/get-vendor?id=${vendorId}`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editVendor = async (vendorId, formDataObj) => {
  try {
    const data = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/edit-vendor?id=${vendorId}`,
      formDataObj,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVendor = async (vendor) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/delete-vendor`,
      vendor,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllVendors = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/delete-all-vendors`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllVendorTransactions = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/get-all-vendor-transactions`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const changeBillingAddress = async (formData) => {
  try {
    const { data } = await axios.patch(
      `${REACT_APP_BACKEND_URL}/purchases/vendors/edit-billing-address`,
      formData,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
