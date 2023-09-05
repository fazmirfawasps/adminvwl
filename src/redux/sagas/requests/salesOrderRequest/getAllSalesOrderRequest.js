import { getAllSalesOrder } from "../../../../services/salesOrderServices"

export async function requestGetAllSalesOrder () {
  const data = await getAllSalesOrder()
  return data;
}