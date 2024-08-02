import { createSlice } from '@reduxjs/toolkit';

export const sancionSlice = createSlice({
    name: 'sancion',
    initialState:{
        sancion: 0
    },
    reducers: {
        setSancion(state, action){
        state.sancion = action.payload;
    }
  }
})

export const { setSancion } = sancionSlice.actions;
export default sancionSlice.reducer;

export const loadsancion =(data)=>(dispatch)=>{
   
    dispatch(setSancion(data));

}