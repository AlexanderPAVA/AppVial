import RNFS from 'react-native-fs';
export function BorrarFotoUrl() {
  const eliminar = async () => {
    try {
      const directoryPath = 'file:///storage/emulated/0/Android/data/com.yoreporto/files/Pictures';
      const files = await RNFS.readdir(directoryPath);
      const jpgFiles = files.filter(file => file.endsWith('.jpg'));
      const filePaths = jpgFiles.map(file => `${directoryPath}/${file}`);
      await Promise.all(filePaths.map(filePath => RNFS.unlink(filePath)));
    } catch (error) {
      console.error('Error al borrar fotos:', error);
    }
  };
  eliminar();
}
