import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

// export const addNewCustomer = async (formDataObj, customerId) => {
//     try {
//         console.log(customerId);
//         const data = await axios.post(`${REACT_APP_BACKEND_URL}/sales/customers/addNewCustomer?id=${customerId}&folderName=Customers`, formDataObj)
//         return data;

//     } catch (error) {
//         console.log(error);

//     }
// }
export const addNewCustomer = async (formDataObj, customerId) => {
  try {
    console.log(customerId);
    const data = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/customers/addNewCustomer?id=${customerId}&folderName=Customers`,
      formDataObj
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllCustomers = async () => {
  try {
    const data = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/customers/getAllCustomer`
    );
    console.log(data,'data');
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOneCustomer = async (clientId) => {
  try {
    const params = {
      folderName: "Customers", // Set the folder name
    };

    const config = {
      params: params,
    };
    const data = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/customers/getCustomerProfile/${clientId}`,
      config
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editCustomer = async (customerId, formDataObj) => {
  try {
    const data = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/customers/editCustomer/${customerId}`,
      formDataObj
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCustomer = async (customer) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/customers/deleteCustomer`,
      customer
    );
    console.log(data,'in serive');
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllCustomers = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/customers/delete-all-customer`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCustomerTransactions = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/customers/get-all-customer-transactions`
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
