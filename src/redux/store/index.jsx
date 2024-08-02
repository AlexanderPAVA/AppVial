import { combineReducers, configureStore} from '@reduxjs/toolkit';
import user from '../slices/login';
import camara from '../slices/linkCamara';
import notiUp from '../slices/notificacion';
import reten from '../slices/SegmentoReten';
import pricarga  from '../slices/PrimeraVezMapa';
import mes from '../slices/CargaMes';
import sancion from '../slices/sancion';
import primvez from '../slices/PrimeraVezApp';
import vernoti from '../slices/VerNoti';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
  user: user,
  camara: camara,
  notiUp: notiUp,
  reten: reten,
  pricarga : pricarga,
  mes: mes,
  sancion: sancion,
  primvez: primvez,
  vernoti: vernoti
 }) 

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'camara', 'notiUp', 'reten', 'pricarga', 'mes', 'sancion', 'primvez', 'vernoti']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
 
});



