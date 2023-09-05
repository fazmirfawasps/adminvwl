import { fetchAllCustomers } from "../../../../services/customerServices";

export async function requestGetAllCustomer () {
  const { data } = await fetchAllCustomers()
  return data;
}