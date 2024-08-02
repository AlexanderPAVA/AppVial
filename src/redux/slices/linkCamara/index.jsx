import { createSlice } from '@reduxjs/toolkit';

export const camaraSlice = createSlice({
    name: 'camara',
    initialState:{
        camara: false
    },
    reducers: {
        setCamara(state, action){
        state.camara = action.payload;
    }
  }
})

export const { setCamara } = camaraSlice.actions;
export default camaraSlice.reducer;

export const camaraload = (datax)=>(dispatch)=>{

    if(datax === true){
        dispatch(setCamara(true));
    }else{
        dispatch(setCamara(false));
    }

}