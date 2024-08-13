import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useEffect } from 'react';

const toastConfig = {
  camara: {
    type: 'success',
    text1: 'Atajo a Cámara',
    text2: 'La próxima vez se abrirá en la cámara',
  },
  camarano: {
    type: 'info',
    text1: 'Inicio normal',
    text2: 'La próxima vez se abrirá normalmente',
  },
  noti: {
    type: 'success',
    text1: 'Notificaciones',
    text2: 'Recibirás Notificaciones de esta App',
  },
  notino: {
    type: 'info',
    text1: 'Notificaciones',
    text2: 'NO Recibirás Notificaciones',
  },
  editFotoSi: {
    type: 'success',
    text1: 'Editar Fotos',
    text2: 'Ajusta antes de subir las fotos',
  },
  editFotoNo: {
    type: 'info',
    text1: 'No hay edición',
    text2: 'Cargarás la imagen directamente',
  },
  otrafoto: {
    type: 'error',
    text1: 'Tomar nueva foto',
    text2: 'No se puede subir la imagen actual',
  },
  sinUser: {
    type: 'error',
    text1: 'Sin registro',
    text2: 'Regístrate para usar la app',
  },
  sinUserdos: {
    type: 'error',
    text1: 'Sin registro',
    text2: 'Regístrate para usar la app',
  },
  sinUsertres: {
    type: 'error',
    text1: 'Sin registro',
    text2: 'Regístrate para usar la app',
  },
  sinGpsHome: {
    type: 'error',
    text1: 'Error GPS',
    text2: 'Error de ubicación, verifique y cargue',
    visibilityTime: 4000,
  },
  sinGpsMapa: {
    type: 'error',
    text1: 'Cargando de nuevo',
    text2: 'Verifíque su GPS',
    visibilityTime: 3000,
  },
  sinConexHome: {
    type: 'error',
    text1: 'Sin Internet',
    text2: 'Verifique y recargue de nuevo',
    visibilityTime: 5000,
  },
  videook: {
    type: 'error',
    text1: 'Video Cargado',
    text2: 'Espere que termine el tiempo',
    visibilityTime: 4000,
  },
  sinDatosMapa: {
    type: 'error',
    text1: 'Sin Pines',
    text2: 'No hay datos para mostrar',
    visibilityTime: 4000,
  },
  sinDatosMapa2: {
    type: 'error',
    text1: 'Sin Pines',
    text2: 'No hay datos para mostrar',
    visibilityTime: 4000,
  },
  sinReporte: {
    type: 'error',
    text1: 'Active Checkbox',
    text2: 'Toque el cuadrito para enviar',
    visibilityTime: 4000,
  },
  delete: {
    type: 'success',
    text1: 'Evento Eliminado',
    text2: 'Verifica en la lista',
    visibilityTime: 4000,
  },
  delete2: {
    type: 'success',
    text1: 'Evento Eliminado',
    text2: 'Recuerda que tienes 5 eliminadas al mes',
    visibilityTime: 4000,
  },
  NoDelete: {
    type: 'error',
    text1: 'No Eliminado',
    text2: 'Ya pasaron más de 2 minutos',
    visibilityTime: 4000,
  },
  NoDeletedos: {
    type: 'error',
    text1: 'No Eliminado',
    text2: 'Pasaste el tope de 5 eventos eliminados al mes',
    visibilityTime: 6000,
  },
  itemBorrado: {
    type: 'error',
    text1: 'Evento Borrado',
    text2: 'Eliminado por el usuario o nuestro equipo',
    visibilityTime: 4000,
  },
  itemBorrado2: {
    type: 'error',
    text1: 'Evento Borrado',
    text2: 'Eliminado por el usuario o nuestro equipo',
    visibilityTime: 4000,
  },
  Listavacia: {
    type: 'error',
    text1: 'No hay datos',
    text2: 'No se ha publicado ningún evento',
    visibilityTime: 4000,
  },
  hayRecorte: {
    type: 'error',
    text1: 'Recortando video',
    text2: 'Te has pasado de los 15 segundos',
    visibilityTime: 6000,
  },
  cargaFotoUser: {
    type: 'info',
    text1: 'Carga una foto de la galería',
    text2: 'Toca la imagen para cargar',
    visibilityTime: 3000,
  },
  fueraPais: {
    type: 'info',
    text1: 'Estás fuera de Colombia',
    text2: 'Mira los eventos que están ocurriendo',
    visibilityTime: 4000,
  },
  sinDpto: {
    type: 'info',
    text1: 'Departamento no encontrado',
    text2: 'Sin envío de notificaciones de retenes',
    visibilityTime: 4000,
  },
  sinDpto1: {
    type: 'info',
    text1: 'País no encontrado',
    text2: 'Estás en una zona sin cobertura',
    visibilityTime: 4000,
  },
  sinDpto2: {
    type: 'info',
    text1: 'Estás fuera del país',
    text2: 'No podrás enviar eventos',
    visibilityTime: 5000,
  },
  sinDpto3: {
    type: 'info',
    text1: 'Acceso global a eventos',
    text2: 'Toca los pines para ver',
    visibilityTime: 5000,
  },
  sinDpto4: {
    type: 'info',
    text1: 'Sin acceso a la cámara',
    text2: 'Ingresa al listado de eventos',
    visibilityTime: 5000,
  },
  errorCarga: {
    type: 'error',
    text1: 'Problema de conexión',
    text2: 'Cargando de nuevo',
    visibilityTime: 3000,
  },
  sharewait: {
    type: 'info',
    text1: 'Espere...',
    text2: 'Abriendo módulo',
    visibilityTime: 2000,
  },
  cambioNombre: {
    type: 'info',
    text1: 'Nombre Cambiado',
    text2: 'Aparecerá al cargar evento',
    visibilityTime: 2000,
  },
  cambioNombre2: {
    type: 'info',
    text1: 'Nombre Cambiado',
    text2: 'Aparecerá al cargar evento',
    visibilityTime: 2000,
  },
  namevacio: {
    type: 'info',
    text1: 'Vacío',
    text2: 'No hay ningún carácter',
    visibilityTime: 3000,
  },
  nombreLargo: {
    type: 'info',
    text1: 'Nombre demasiado largo',
    text2: 'Cargue un nombre corto',
    visibilityTime: 3000,
  },
  brujulaBaja: {
    type: 'error',
    text1: 'Ubicación GPS baja',
    text2: 'Cargue comentario de donde está ubicado',
    visibilityTime: 5000,
  },
  sinFoto: {
    type: 'error',
    text1: 'No hay foto',
    text2: 'Carga tu foto desde configuración',
    visibilityTime: 5000,
  },
  cambioFoto: {
    type: 'error',
    text1: 'Imagen Actual',
    text2: 'Carga tu foto desde configuración',
    visibilityTime: 5000,
  },
  sinNavegador: {
    type: 'error',
    text1: 'Error al abrir navegador',
    text2: 'Verifica e instala un navegador',
    visibilityTime: 5000,
  },
};

const ToastServicios = ({ dato }) => {
  useEffect(() => {
    if (dato && toastConfig[dato]) {
      Toast.show({
        ...toastConfig[dato],
        position: 'bottom',
        bottomOffset: 120,
        visibilityTime: toastConfig[dato].visibilityTime || 3500, // default visibilityTime
      });
    }
  }, [dato]);

  return (
    <View>
      <Toast />
    </View>
  );
};

export default ToastServicios;
