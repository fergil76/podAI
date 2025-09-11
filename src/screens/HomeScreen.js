import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation, route }) {
  const email = route?.params?.email || null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a PodAI 🌳</Text>
      <Text style={styles.subtitle}>{email ? `Sesión iniciada como ${email}` : "Has iniciado sesión correctamente."}</Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate("Profile", { email })}>
        <Text style={styles.buttonText}>Ir al Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.replace("Login")}>
        <Text style={styles.buttonTextSecondary}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc", padding: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#475569", marginBottom: 20 },
  buttonPrimary: { backgroundColor: "#2563eb", padding: 14, borderRadius: 12, width: "80%", alignItems: "center", marginBottom: 12 },
  buttonSecondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", padding: 14, borderRadius: 12, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  buttonTextSecondary: { color: "#0f172a", fontWeight: "700" }
});
