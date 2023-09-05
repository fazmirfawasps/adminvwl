import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

const token = localStorage.getItem('adminToken')

export const adminLogin = async (formValues) => {
    try {
        const data = await axios.post(`${REACT_APP_BACKEND_URL}/admin/adminLogin`, formValues);
        return data;
    } catch (error) {
        console.log(error.response.data,'service');
        throw error.response.data;

    }
}

export const getAdmin = async () => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/admin/getAdmin`, { headers: { token } });
        return data;
    } catch (error) {
        console.log(error);
    }
}