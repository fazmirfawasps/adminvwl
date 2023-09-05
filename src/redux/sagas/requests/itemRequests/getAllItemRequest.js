import { fetchAllItems } from "../../../../services/ItemService";

export async function requestGetAllItem() {
    const { data } = await fetchAllItems()
    return data;
}