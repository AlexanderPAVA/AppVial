import { createSlice } from '@reduxjs/toolkit';

export const mesSlice = createSlice({
    name: 'mes',
    initialState:{
        mes: ''
    },
    reducers: {
        setmes(state, action){
        state.mes = action.payload;
    }
  }
})

export const { setmes } = mesSlice.actions;
export default mesSlice.reducer;

export const loadmes =(data)=>(dispatch)=>{
        dispatch(setmes(data));
}