import React from 'react';
import AlertPro from 'react-native-alert-pro';

const ProAlert = ({cargar, noCargar, titulo}) => {
  return (
    <AlertPro
    ref={ref => {
      this.AlertPro = ref;
    }}
    onConfirm={() => cargar()}
    onCancel={() => noCargar()}
    title={titulo}
    message=""
    textCancel="NO"
    textConfirm="SI"
    customStyles={{
      mask: {
        backgroundColor: 'rgba(0, 0, 0, 1)'
      },
      container: {
        borderWidth: 3,
        borderRadius: 15,
        borderColor: "#FFBB21",
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 10
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
}

export default ProAlert;