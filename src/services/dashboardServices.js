import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../config/config";

export const getDashboardData = async () => {
  try {
    const { data } = await axios.get(
      `${REACT_APP_BACKEND_URL}/home/get-dashboard-data`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
