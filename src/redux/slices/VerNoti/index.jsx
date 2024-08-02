import { createSlice } from '@reduxjs/toolkit';

export const vernotiSlice = createSlice({
    name: 'vernoti',
    initialState:{
        vernoti: 0
    },
    reducers: {
        setvernoti(state, action){
        state.vernoti = action.payload;
    }
  }
})

export const { setvernoti } = vernotiSlice.actions;
export default vernotiSlice.reducer;

export const loadvernoti =(data)=>(dispatch)=>{
   
    dispatch(setvernoti(data));

}