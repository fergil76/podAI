import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa pantallas
import HomeScreen from './src/screens/HomeScreen';
import TreesScreen from './src/screens/TreesScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import NewPhotoScreen from './src/screens/NewPhotoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ onLogout }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Árboles" component={TreesScreen} />
      <Tab.Screen name="Nueva Foto" component={NewPhotoScreen} />
      <Tab.Screen name="Comunidad" component={CommunityScreen} />
      <Tab.Screen name="Perfil">
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {props => (
                <RegisterScreen {...props} onRegister={() => setIsLoggedIn(true)} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Main">
            {props => <Tabs {...props} onLogout={() => setIsLoggedIn(false)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
