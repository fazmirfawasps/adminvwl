import { getAllEstimates } from "../../../../services/estimateServices"

export async function requestGetAllEstimate () {
  const data = await getAllEstimates()
  return data;
}