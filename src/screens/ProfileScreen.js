// src/screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen({ onLogout, route }) {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("currentUser");
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.error("loadUser error", err);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("🔴 Profile: handleLogout start");
      await AsyncStorage.removeItem("currentUser");
      console.log("🔴 Profile: removed currentUser from storage");

      // onLogout puede venir como prop o en route.params (por cómo pasamos la prop desde Tabs)
      const logoutFn = onLogout ?? route?.params?.onLogout;

      if (logoutFn && typeof logoutFn === "function") {
        console.log("🔴 Profile: calling logoutFn()");
        logoutFn();
      } else {
        console.log("🔴 Profile: logoutFn not found, resetting navigation to Login");
        // Si no hay logoutFn, forzamos volver al login
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    } catch (err) {
      console.error("handleLogout error", err);
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil</Text>
      {user ? (
        <>
          <Text style={styles.text}>Nombre: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>No hay usuario cargado</Text>
      )}

      <View style={{ marginTop: 20, width: "80%" }}>
        <Button title="Cerrar sesión" color="#c62828" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#f6fff7" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  text: { fontSize: 16, marginVertical: 6 },
});
