import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

export const addNewItem = async (formDataObj, itemId) => {
    try {
        const data = await axios.post(`${REACT_APP_BACKEND_URL}/sales/items/addNewItem?id=${itemId}&folderName=Items`, formDataObj)
        return data;

    } catch (error) {
        console.log(error);

    }
}

export const editAllItem = async (formDataObj) => {
    try {
        const data = await axios.put(`${REACT_APP_BACKEND_URL}/sales/items/editFullItem`, formDataObj)
        return data
    } catch (error) {
        console.log(error);

    }
}


export const fetchAllItems = async () => {
    try {
        const {data} = await axios.get(`${REACT_APP_BACKEND_URL}/sales/items/getAllItems`)
        return data;

    } catch (error) {
        console.log(error);

    }
}

export const fetchOneItem = async (itemId) => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/sales/items/getOneItem/${itemId}`)
        return data;

    } catch (error) {
        console.log(error);

    }
}

export const deleteItem = async (item) => {
    try {
      const { data } = await axios.put(
        `${REACT_APP_BACKEND_URL}/sales/items/deleteItem`,
        item
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const deleteAllItems = async () => {
    try {
      const { data } = await axios.put(
        `${REACT_APP_BACKEND_URL}/sales/items/deleteAllItem`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };




export const addCategory = async (categoryData) => {
    try {
        const data = await axios.post(`${REACT_APP_BACKEND_URL}/sales/items/addCategory`, categoryData)
        return data
    } catch (error) {
        console.log(error);

    }
}

export const getAllParentCategories = async () => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/sales/items/getAllParentCategories`)
        return data

    } catch (error) {
        console.log(error);

    }
}

export const getAllCategories = async () => {
    try {
        const { data } = await axios.get(`${REACT_APP_BACKEND_URL}/sales/items/getAllCategories`)
        return data

    } catch (error) {
        console.log(error);

    }
}



export const fetchAllUnits = async () => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/sales/items/getAllUnits`)
        return data;

    } catch (error) {
        console.log(error);

    }
}

export const editItem = async (itemId, formDataObj) => {
    try {
        const data = await axios.put(`${REACT_APP_BACKEND_URL}/sales/items/editItem/${itemId}`, formDataObj)
        return data;

    } catch (error) {
        console.log(error);

    }
}


export const addUnit = async (unitData) => {
    try {
        const data = await axios.post(`${REACT_APP_BACKEND_URL}/sales/items/addUnit`, unitData)
        return data

    } catch (error) {
        console.log(error);

    }
}