import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem('adminToken')

export const addNewCompany = async (formDataObj) => {
    try {
        const data = await axios.post(
            `${REACT_APP_BACKEND_URL}/settings/profile/addProfile?folderName=profile`,
            formDataObj, { headers: { token: token } }
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async () => {
    try {
        const data = await axios.get(
            `${REACT_APP_BACKEND_URL}/settings/profile/getProfile`, { headers: { token: token } }
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (formDataObj, id) => {
    const encodedId = encodeURIComponent(id);
    const folderName = "profile";
    console.log(id,'formData id');
    try {
        const data = await axios.put(
            `${REACT_APP_BACKEND_URL}/settings/profile/editProfile/${encodedId}?folderName=${folderName}`, formDataObj,
            { headers: { token: token } }
            );
            return data;
    } catch (error) {
        console.log(error);

    }
}