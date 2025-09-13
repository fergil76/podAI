import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Bienvenido a PodAI</Text>
      <Text style={styles.subtitle}>
        Tu asistente para el cuidado y poda de bonsáis y arbustos.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Trees")}
      >
        <Ionicons name="leaf-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Mis Árboles</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Community")}
      >
        <Ionicons name="people-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Comunidad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("NewPhoto")}
      >
        <Ionicons name="camera-outline" size={20} color="#4CAF50" />
        <Text style={[styles.buttonText, { color: "#4CAF50" }]}>
          Nueva Foto
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: "#333" },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#fff",
  },
});

