import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

export const addNewBank = async (formData) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/accounting/banking/add-new-bank-or-credit-card`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBanks = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/accounting/banking/get-all-banks`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewCreditCard = async (formData) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/accounting/banking/add-new-credit-card`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewExpense = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/accounting/banking/get-add-new-expense`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewExpense = async (formData) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/accounting/banking/add-new-expense`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editExpense = async (formData) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/accounting/banking/edit-expense`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllExpenses = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/accounting/banking/get-all-expenses`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewContraEntry = async (formData) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/accounting/banking/add-new-contra-entry`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteExpense = async (expense) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/accounting/banking/delete-expense`,
      expense
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getPettyCash = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/accounting/banking/get-petty-cash`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllContraEntry = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/accounting/banking/get-all-contra-entry`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editContraEntry = async (formData) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/accounting/banking/edit-contra-entry`,
      formData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
