import RNFS from 'react-native-fs';
export function BorrarFotoUrl(uriImg) {
    const eliminar = ()=>{
        if (uriImg) {
        try {        
            RNFS.readdir('file:///storage/emulated/0/Android/data/com.yoreporto/files/Pictures')
            .then((files) => {
              const jpgFiles = files.filter((file) => file.endsWith('.jpg'));
              jpgFiles.forEach((file) => {
                const filePath = `${'file:///storage/emulated/0/Android/data/com.yoreporto/files/Pictures'}/${file}`;
                   RNFS.unlink(filePath)
                  .then(() => {
                    //console.log(`Imagen ${file} borrada exitosamente`);
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
};
