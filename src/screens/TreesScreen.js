import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TreesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌳 Mis Árboles</Text>

      <Text style={styles.subtitle}>
        Aquí aparecerán los árboles que registres.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Aquí luego agregaremos un nuevo árbol")}
      >
        <Text style={styles.buttonText}>➕ Agregar árbol</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

