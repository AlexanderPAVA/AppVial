import RNFS from 'react-native-fs';
export function BorrarVideosUrl(uriImg) {
    const eliminar = ()=>{
        if (uriImg) {
        try {
            RNFS.readdir('file:///storage/emulated/0/Android/data/com.yoreporto/files/Pictures')
            .then((files) => {
              const jpgFiles = files.filter((file) => file.endsWith('.mp4'));
              jpgFiles.forEach((file) => {
                const filePath = `${'file:///storage/emulated/0/Android/data/com.yoreporto/files/Pictures'}/${file}`;
                   RNFS.unlink(filePath)
                  .then(() => {
                  })
                  .catch((err) => {
                  });
              });
            })
         
        } catch (error) { 
        }
      } else {
      }    
    }
    eliminar();
}
