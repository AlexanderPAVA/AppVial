import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState:{
        user: null
    },
    reducers: {
        setLogin(state, action){
        state.user = action.payload;
    }
  }
})

export const { setLogin } = userSlice.actions;
export default userSlice.reducer;

export const registro =(data)=>(dispatch)=>{
   
    if(data === null){
        dispatch(setLogin(null));
    }else{
        dispatch(setLogin(data));
    }

}