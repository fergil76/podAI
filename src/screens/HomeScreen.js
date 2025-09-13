import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Bienvenido a PodAI</Text>
      <Text style={styles.subtitle}>
        Tu asistente inteligente para el cuidado y poda de bonsáis y arbustos
      </Text>

      {/* Botón Mis Árboles */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Trees")}
      >
        <Text style={styles.buttonText}>🌳 Mis Árboles</Text>
      </TouchableOpacity>

      {/* Botón Comunidad */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Community")}
      >
        <Text style={styles.buttonText}>🌍 Comunidad</Text>
      </TouchableOpacity>

      {/* Botón Perfil */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>👤 Perfil</Text>
      </TouchableOpacity>

      {/* Botón Escaneo IA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ScanIA")}
      >
        <Text style={styles.buttonText}>🤖 Escaneo IA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
