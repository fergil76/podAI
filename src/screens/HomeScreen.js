import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Bienvenido a PodAI</Text>
      <Text style={styles.subtitle}>Acceso rápido a todo</Text>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Trees")}
        >
          <Text style={styles.cardText}>🌳 Mis Árboles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Community")}
        >
          <Text style={styles.cardText}>👥 Comunidad</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.cardText}>🙍‍♂️ Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  menu: {
    width: "100%",
  },
  card: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
