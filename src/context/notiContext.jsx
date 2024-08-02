import React, { createContext, useState } from 'react';
import OneSignal from 'react-native-onesignal';
import axios from 'axios';
import config from '../config';
const RUTA_HOME_DOS = config.RUTA_HOME_DOS;
export const notiContext = createContext();
export const MyProvider = ({ children }) => {

  const [enterNoti, setEnterNoti] = useState(0);
  const [msjNoti, setMsjNoti] = useState('');
  const [itemBorrado, setItemBorrado] = useState(0);

  OneSignal.setNotificationOpenedHandler(openedEvent => {
    const { action, notification } = openedEvent;
    const data = notification.additionalData;
    if (data !== undefined && data !== null) {
      axios.post(RUTA_HOME_DOS, {
        codigo: data.codigoId,
        emailusu: data.emailUsu
      }).then(resp => {
        if (resp.data !== 0) {
          const datos = resp.data;
          const item = datos[0];
          setEnterNoti(item);
          setMsjNoti('Espere...');
        } else {
          setItemBorrado(1);
          setMsjNoti('Espere...');
        };
      }).catch(function (error) {
      });
    };
  });

  return (
    <notiContext.Provider value={{ enterNoti, setEnterNoti, msjNoti, setMsjNoti, itemBorrado, setItemBorrado }}>
      {children}
    </notiContext.Provider>
  );
};