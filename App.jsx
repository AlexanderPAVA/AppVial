import React, { useEffect } from 'react';
import Home from './src/pages/Home'
import Camara from './src/pages/Camara';
import Mapa from './src/pages/Mapa';
import Listados from './src/pages/Listados';
import LoginUser from './src/pages/LoginUser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Individual from './src/pages/Individual';
import ListaReporte from './src/components/ListaReporte';
import SplashScreen from 'react-native-splash-screen';
import { MyProvider } from './src/context/notiContext';
import MyWebView from './src/pages/MyWebView';

const persistor = persistStore(store);
const Stack = createNativeStackNavigator();
function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <PersistGate persistor={persistor}>
    <Provider store={store}> 
    <MyProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Mapa" component={Mapa} />
        <Stack.Screen name="Camara" component={Camara} />
        <Stack.Screen name="Listados" component={Listados} />
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="Individual" component={Individual} />
        <Stack.Screen name="ListaReporte" component={ListaReporte} />
        <Stack.Screen name="MyWebView" component={MyWebView} />
      
      </Stack.Navigator>
    </NavigationContainer>
    </MyProvider>
    </Provider>
    </PersistGate>
  )
}
export default App;