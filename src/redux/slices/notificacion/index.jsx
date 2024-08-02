import { createSlice } from '@reduxjs/toolkit';
import OneSignal from 'react-native-onesignal';

export const notiSlice = createSlice({
    name: 'notiUp',
    initialState:{
        notiUp: false
    },
    reducers: {
        setNoti(state, action){
        state.notiUp = action.payload;
    }
  }
})

export const { setNoti } = notiSlice.actions;
export default notiSlice.reducer;

export const loadNoti = (datan)=>(dispatch)=>{

    if(datan === true){
        dispatch(setNoti(true));
        OneSignal.disablePush(false);
    }else{
        dispatch(setNoti(false));
        OneSignal.disablePush(true);
    }

}