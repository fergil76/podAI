// src/screens/ProfileScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ProfileScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Mi Perfil</Text>
      <Text style={styles.subtitle}>Usuario: jardinero@podai.com</Text>

      <View style={styles.logoutButton}>
        <Button title="Cerrar sesión" color="#E53935" onPress={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  logoutButton: {
    width: "80%",
    marginTop: 20,
  },
});
