import axios from 'axios'
import { REACT_APP_BACKEND_URL } from "../config/config";
const token = localStorage.getItem('adminToken')
export const addChartOfAccounts = async (formValues) => {
    try {
        const data = await axios.post(`${REACT_APP_BACKEND_URL}/accounting/journalEntry/addNewChartOfAccounts`,
            formValues, { headers: { token: token } });
        return data;

    } catch (error) {
        console.log(error);

    }
}

export const getChartOfAccounts = async () => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/accounting/journalEntry/getAllChartOfAccounts`);
        return data;

    } catch (error) {
        console.log(error);

    }
}


export const addNewJournal = async (formDataObj, pettyCashStatus = false) => {
    console.log(formDataObj);
    try {
        const data = await axios.post(`${REACT_APP_BACKEND_URL}/accounting/journalEntry/addNewJournal?pettyCash=${pettyCashStatus}`,
            formDataObj, { headers: { token: token } });
        return data
    } catch (error) {
        console.log(error);

    }
}

export const getJournal = async () => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/accounting/journalEntry/getAllJournal`, { headers: { token: token } });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchOneJournal = async (journalId) => {
    try {
        const data = await axios.get(`${REACT_APP_BACKEND_URL}/accounting/journalEntry/fetchOneJournal/${journalId}`, { headers: { token: token } });
        return data;
    } catch (error) {
        console.log(error);
        
    }

}