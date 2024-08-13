import React, { useEffect }  from 'react';
import { WebView } from 'react-native-webview';
import {
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyWebView = () => {
  const navigation = useNavigation();
  const titulo = () => {
    return (
      <View>
        <Text style={{
          fontSize: 1,
          color: '#000000',
        }}></Text>
      </View>
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
          color: '#fff',
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
