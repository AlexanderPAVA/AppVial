import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useEffect } from 'react';
const ToastServicios = ({dato}) => {
useEffect(() => {

  if(dato === ''){
        
  }else if(dato === 'camara'){
    Toast.show({
      type: 'success',
      text1: 'Atajo a Cámara',
      text2: 'La proxima vez se abrirá en la cámara',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });

  }else if(dato === 'camarano'){
    Toast.show({
      type: 'info',
      text1: 'Inicio normal',
      text2: 'La proxima vez se abrirá normalmente',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });

   }else if(dato === 'noti'){
    Toast.show({
      type: 'success',
      text1: 'Notificaciones',
      text2: 'Recibirás Notificaciones de esta App',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });
  }else if(dato === 'notino'){
    Toast.show({
      type: 'info',
      text1: 'Notificaciones',
      text2: 'NO Recibirás Notificaciones',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });

  }else if(dato === 'editFotoSi'){
    Toast.show({
      type: 'success',
      text1: 'Editar Fotos',
      text2: 'Ajusta antes de subir las fotos',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });
  }else if(dato === 'editFotoNo'){
    Toast.show({
      type: 'info',
      text1: 'No hay edición',
      text2: 'Cargarás la imagen directamente',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });
  }else if(dato === 'otrafoto'){
    Toast.show({
      type: 'error',
      text1: 'Tomar nueva foto',
      text2: 'No se puede subir la imagen actual',
      position: 'bottom',
      bottomOffset: 120,
      visibilityTime: 3500
    });

  }else if(dato === 'sinUser'){
      Toast.show({
        type: 'error',
        text1: 'Sin registro',
        text2: 'Registrate para usar la app',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3500
      });
    }else if(dato === 'sinUserdos'){
      Toast.show({
        type: 'error',
        text1: 'Sin registro',
        text2: 'Registrate para usar la app',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3500
      });
    }else if(dato === 'sinUsertres'){
      Toast.show({
        type: 'error',
        text1: 'Sin registro',
        text2: 'Registrate para usar la app',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3500
      });

    }else if(dato === 'sinGpsHome'){
      Toast.show({
        type: 'error',
        text1: 'Error GPS',
        text2: 'Error de ubicación, verifique y cargue',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinGpsMapa'){
      Toast.show({
        type: 'error',
        text1: 'Cargando de nuevo',
        text2: 'Verifíque su GPS',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3000
      });

    }else if(dato === 'sinConexHome'){
      Toast.show({
        type: 'error',
        text1: 'Sin Internet',
        text2: 'Verifique y recargue de nuevo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

    }else if(dato === 'videook'){
      Toast.show({
        type: 'error',
        text1: 'Video Cargado',
        text2: 'Espere que termine el tiempo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinDatosMapa'){
      Toast.show({
        type: 'error',
        text1: 'Sin Pines',
        text2: 'No hay datos para mostrar',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinDatosMapa2'){
      Toast.show({
        type: 'error',
        text1: 'Sin Pines',
        text2: 'No hay datos para mostrar',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinReporte'){
      Toast.show({
        type: 'error',
        text1: 'Active Checkbox',
        text2: 'Toque el cuadrito para enviar',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'delete'){
      Toast.show({
        type: 'success',
        text1: 'Evento Eliminado',
        text2: 'Verifica en la lista',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'delete2'){
      Toast.show({
        type: 'success',
        text1: 'Evento Eliminado',
        text2: 'Recuerda que tienes 5 eliminadas al mes',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'NoDelete'){
      Toast.show({
        type: 'error',
        text1: 'No Eliminado',
        text2: 'Ya pasaron más de 2 minutos',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'NoDeletedos'){
      Toast.show({
        type: 'error',
        text1: 'No Eliminado',
        text2: 'Pasate el tope de 5 eventos eliminados al mes',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 6000
      });

    }else if(dato === 'itemBorrado'){
      Toast.show({
        type: 'error',
        text1: 'Evento Borrado',
        text2: 'Eliminado por el usuario o nuestro equipo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });
    }else if(dato === 'itemBorrado2'){
      Toast.show({
        type: 'error',
        text1: 'Evento Borrado',
        text2: 'Eliminado por el usuario o nuestro equipo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'Listavacia'){
      Toast.show({
        type: 'error',
        text1: 'No hay datos',
        text2: 'No se ha publicado ningun evento',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'hayRecorte'){
      Toast.show({
        type: 'error',
        text1: 'Recortando video',
        text2: 'Te has pasado de los 15 segundos',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 6000
      });

    }else if(dato === 'cargaFotoUser'){
      Toast.show({
        type: 'info',
        text1: 'Carga una foto de la galería',
        text2: 'Toca la imagen para cargar',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3000
      });

    }else if(dato === 'fueraPais'){
      Toast.show({
        type: 'info',
        text1: 'Estás fuera de Colombia',
        text2: 'Mira los eventos que están ocurriendo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinDpto'){
      Toast.show({
        type: 'info',
        text1: 'Departamento no encontrado',
        text2: 'Sin envío de notificaciones de retenes',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinDpto1'){
      Toast.show({
        type: 'info',
        text1: 'País no encontrado',
        text2: 'Estas en una zona sin cobertura',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 4000
      });

    }else if(dato === 'sinDpto2'){
      Toast.show({
        type: 'info',
        text1: 'Estás fuera del país',
        text2: 'No podrás enviar eventos',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

    }else if(dato === 'sinDpto3'){
      Toast.show({
        type: 'info',
        text1: 'Acceso global a eventos',
        text2: 'Toca los pines para ver',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

    }else if(dato === 'sinDpto4'){
      Toast.show({
        type: 'info',
        text1: 'Sin acceso a la cámara',
        text2: 'Ingresa al listado de eventos',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

    }else if(dato === 'errorCarga'){
      Toast.show({
        type: 'error',
        text1: 'Problema de conexión',
        text2: 'Cargando de nuevo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3000
      });

    }else if(dato === 'sharewait'){
      Toast.show({
        type: 'info',
        text1: 'Espere...',
        text2: 'Abriendo modulo',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 2000
      });

    }else if(dato === 'cambioNombre'){
      Toast.show({
        type: 'info',
        text1: 'Nombre Cambiado',
        text2: 'Aparecerá al cargar evento',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 2000
      });

    }else if(dato === 'cambioNombre2'){
      Toast.show({
        type: 'info',
        text1: 'Nombre Cambiado',
        text2: 'Aparecerá al cargar evento',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 2000
      });

    }else if(dato === 'namevacio'){
      Toast.show({
        type: 'info',
        text1: 'Vacío',
        text2: 'No hay ningún caracter',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3000
      });

    }else if(dato === 'nombreLargo'){
      Toast.show({
        type: 'info',
        text1: 'Nombre demasiado largo',
        text2: 'Cargue un nombre corto',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 3000
      });

    }else if(dato === 'brujulaBaja'){
      Toast.show({
        type: 'error',
        text1: 'Ubicación GPS baja',
        text2: 'Cargue comentario de donde está ubicado',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

    }else if(dato === 'sinFoto'){
      Toast.show({
        type: 'error',
        text1: 'No hay foto',
        text2: 'Carga tu foto desde configuración',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });
    }else if(dato === 'cambioFoto'){
      Toast.show({
        type: 'error',
        text1: 'Imagen Actual',
        text2: 'Carga tu foto desde configuración',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

    }else if(dato === 'sinNavegador'){
      Toast.show({
        type: 'error',
        text1: 'Error al abrir navegador',
        text2: 'Verifica e instala un navegador',
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: 5000
      });

  }else{
       
   }

}, [dato])
  return (
    <View>
       <Toast/>
    </View>
  )
}
export default ToastServicios;