import { createSlice } from "@reduxjs/toolkit";

const countrySlice=createSlice({
    name:'country',
    initialState:{
        countryCode:''

    },
    reducers:{
        setCountryCode:(state,action)=>{
            console.log(action.payload,'action');
            state.countryCode = action.payload;

        }
        
    }
});

export const {setCountryCode}=countrySlice.actions;
export default countrySlice.reducer;

