import RNFS from 'react-native-fs';

export function BorrarImageUrl(uriImg) {
    const eliminar = async()=>{
        if (uriImg) {
        try {
          await RNFS.unlink(uriImg);
        } catch (error) {
        }
      } else {
      }    
    }
    eliminar();
}
