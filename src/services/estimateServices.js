import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem("adminToken");

export const addNewEstimate = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/estimates/new-estimate`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewEstimate = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/estimates/get-new-estimate`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllEstimates = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/estimates/get-all-estimates`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAddNewQuote = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/estimates/get-new-quote`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllQuotes = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/sales/estimates/get-all-quotes`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addNewQuote = async (formDataObj) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/estimates/add-new-quote`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editItem = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/edit-item`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteEstimate = async (estimatesList) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/delete-estimate`,
      estimatesList,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteAllEstimates = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/delete-all-estimates`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuote = async (quotesList) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/delete-quote`,
      quotesList,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteAllQuotes = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/delete-all-quotes`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteBothEstimateAndQuote = async (estimate, quote) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/delete-both-estimate-and-quote`,
      { estimate, quote },
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteAllEstimatesAndQuotes = async () => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/delete-all-estimates-and-quotes`,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editEstimate = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/edit-estimate`,
      formDataObj,
      { headers: { token: token } }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editQuote = async (formDataObj) => {
  try {
    const { data } = await axios.put(
      `${REACT_APP_BACKEND_URL}/sales/estimates/edit-quote`,
      formDataObj,
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
      `${REACT_APP_BACKEND_URL}/sales/estimates/edit-billing-address`,
      formData,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const convertToInvoice = async (formData) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_BACKEND_URL}/sales/estimates/convert-to-invoice`,
      formData,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const changeEstimateStatus = async (values) => {
  try {
    const { data } = await axios.patch(
      `${REACT_APP_BACKEND_URL}/sales/estimates/change-estimate-status`,
      values,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const changeQuoteStatus = async (values) => {
  try {
    const { data } = await axios.patch(
      `${REACT_APP_BACKEND_URL}/sales/estimates/change-quote-status`,
      values,
      { headers: { token: token } }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};
