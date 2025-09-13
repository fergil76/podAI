import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

export default function TreeDetailScreen({ route }) {
  const { photo } = route.params; // la foto que viene de TreesScreen

  const handleSendToAI = () => {
    // 🔹 Aquí luego conectaremos con el backend de IA
    Alert.alert(
      "Enviado a IA",
      "Tu árbol ha sido enviado a la IA para análisis de poda. Recibirás una propuesta pronto."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Árbol</Text>
      <Image source={{ uri: photo }} style={styles.image} />

      <TouchableOpacity style={styles.aiButton} onPress={handleSendToAI}>
        <Text style={styles.aiButtonText}>🌱 Enviar a IA para poda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f5",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#2e7d32",
  },
  image: {
    width: "90%",
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  aiButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  aiButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
