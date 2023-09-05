import { createSlice } from "@reduxjs/toolkit";

const journalEntrySlice = createSlice({
  name: "journalEntrys",
  initialState: {
    journalEntryList: [],
  },
  reducers: {
    getJournalEntry() {},
    setJouranlEntrys: (state, action) => {
      const journalEntryList = action.payload;
      return { ...state, journalEntryList };
    },
  },
});

export const { getJournalEntry, setJouranlEntrys } = journalEntrySlice.actions;

export default journalEntrySlice.reducer;
