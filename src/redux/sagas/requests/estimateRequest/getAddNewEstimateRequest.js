import { getAddNewEstimate } from "../../../../services/estimateServices"

export async function requestGetAddNewEstimate () {
  const data = await getAddNewEstimate()
  return data;
}