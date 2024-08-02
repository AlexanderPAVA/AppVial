import { createSlice } from '@reduxjs/toolkit';

export const primvezSlice = createSlice({
    name: 'primvez',
    initialState:{
        primvez: 0
    },
    reducers: {
        setprimvez(state, action){
        state.primvez = action.payload;
    }
  }
})

export const { setprimvez } = primvezSlice.actions;
export default primvezSlice.reducer;

export const loadprimvez =(data)=>(dispatch)=>{
   
        dispatch(setprimvez(data));
   
}