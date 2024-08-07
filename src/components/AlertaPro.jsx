import React from 'react';
import AlertPro from 'react-native-alert-pro';

function AlertaPro({quitar, cancel}) {
  return (
    <AlertPro
        ref={ref => {
          AlertPro = ref;
        }}
        onConfirm={() => quitar()}
        onCancel={() => cancel()}
        title={'¿Desea eliminar este evento?'}
        message=""
        textCancel="NO"
        textConfirm="SI"
        customStyles={{
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 1)'
          },
          buttonCancel: {
            backgroundColor: "#DF0000",
            marginHorizontal: 20,
            height: 50
          },
          buttonConfirm: {
            backgroundColor: "#007A09",
            marginHorizontal: 20,
          },
          title: {
            fontSize: 20,
          },
          textCancel: {
            marginTop: 3
          },
          textConfirm: {
            marginTop: 3
          }
        }}
      />
  )
};

export default AlertaPro;
