import { getChartOfAccounts } from "../../../../services/journalEntryService";

export async function requestGetAllChartOfAccounts() {
  const { data } = await getChartOfAccounts()
  return data;
}