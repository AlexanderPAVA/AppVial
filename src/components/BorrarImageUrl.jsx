import RNFS from 'react-native-fs';
export function BorrarImageUrl(uriImg) {
  if (!uriImg) return;  // Salir si uriImg no está definido o es nulo
  const eliminar = async () => {
    try {
      await RNFS.unlink(uriImg);
    } catch (error) {
      console.error('Error al borrar la imagen:', error);
    }
  };
  eliminar();
}
