import { createSlice } from '@reduxjs/toolkit';

export const pricargaSlice = createSlice({
    name: 'pricarga',
    initialState:{
        pricarga: 2
    },
    reducers: {
        setpricarga(state, action){
        state.pricarga = action.payload;
    }
  }
})

export const { setpricarga } = pricargaSlice.actions;
export default pricargaSlice.reducer;

export const loadpricarga =(data)=>(dispatch)=>{
   
        dispatch(setpricarga(data));
   
}