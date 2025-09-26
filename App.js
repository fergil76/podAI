import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Importamos navegación por tabs
import Tabs from "./src/navigation/Tabs";
// Importamos pantallas de auth
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
// Pantallas adicionales
import TreeDetailScreen from "./src/screens/TreeDetailScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login">
              {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {() => <RegisterScreen onRegister={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Main">
              {() => <Tabs onLogout={() => setIsLoggedIn(false)} />}
            </Stack.Screen>
            {/* Pantalla de detalle de árbol */}
            <Stack.Screen name="TreeDetail" component={TreeDetailScreen} />
            {/* Pantalla de notificaciones estacionales */}
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}