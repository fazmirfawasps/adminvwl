import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

export const addTax = async (taxData) => {
  try {
    const data = await axios.post(
      `${REACT_APP_BACKEND_URL}/settings/tax/addTax`,
      taxData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTax = async (id) => {
  try {
    const data = await axios.get(
      `${REACT_APP_BACKEND_URL}/settings/tax/getAllTaxes/${id}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addGroup = async (groupData) => {
  try {
    const data = await axios.post(
      `${REACT_APP_BACKEND_URL}/settings/tax/addNewGroup`,
      groupData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllGroupedTax = async () => {
  try {
    const data = await axios.get(
      `${REACT_APP_BACKEND_URL}/settings/tax/getAllGroupTaxes`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTax=async(tax)=>{
  try {
    console.log('api call',tax);
    const data = await axios.put(
      `${REACT_APP_BACKEND_URL}/settings/tax/deleteTax`,
      tax
      );
      return data
  } catch (error) {
    
  }
}


export const deleteAllTaxes=async()=>{
  try {
    const data = await axios.put(
      `${REACT_APP_BACKEND_URL}/settings/tax/delteTax`,
      
    );
  } catch (error) {
    
  }
}
