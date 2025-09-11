import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileScreen({ navigation, route }) {
  const email = route?.params?.email || "usuario@ejemplo.com";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.info}>Correo: {email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Login")}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc", padding: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a", marginBottom: 12 },
  info: { fontSize: 16, color: "#475569", marginBottom: 24 },
  button: { backgroundColor: "#DC2626", padding: 12, borderRadius: 12, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" }
});
