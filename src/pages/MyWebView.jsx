import React, { useEffect }  from 'react';
import { WebView } from 'react-native-webview';
import {
  Text
} from 'react-native';

const MyWebView = ({ navigation }) => {

  const titulo = () => {
    return (
      <>
        <Text style={{
          fontSize: 1,
          color: '#000000',
        }}></Text>
      </>
    )
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000' },
      headerTitle: titulo,
      headerShown: true,
      headerTintColor: '#fff',
      headerRight: () => (
        <Text style={{
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
        }}>Políticas y Condiciones</Text>
      )
    });
  }, []);

  return (
    <WebView
      source={{ uri: 'https://sites.google.com/view/politicasycondiciones/inicio' }}
      style={{ marginTop: 0 }}
    />
  );
};

export default MyWebView;