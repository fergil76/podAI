// src/screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Bienvenido a PodAI</Text>
      <Text style={styles.subtitle}>Acceso rápido a todo</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Árboles")} // ✅ Nombre del tab
      >
        <Text style={styles.buttonText}>🌳 Mis Árboles</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Comunidad")} // ✅ Nombre del tab
      >
        <Text style={styles.buttonText}>👥 Comunidad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Perfil")} // ✅ Nombre del tab
      >
        <Text style={styles.buttonText}>👤 Perfil</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
