import { createSlice } from '@reduxjs/toolkit';

export const retenSlice = createSlice({
    name: 'reten',
    initialState:{
        reten: null
    },
    reducers: {
        setReten(state, action){
        state.reten = action.payload;
    }
  }
})

export const { setReten } = retenSlice.actions;
export default retenSlice.reducer;

export const loadReten =(data)=>(dispatch)=>{
   
        dispatch(setReten(data));
   
}