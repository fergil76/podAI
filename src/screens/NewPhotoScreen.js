import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NewPhotoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Nueva Foto</Text>
      <Text>Sube o toma una foto de tu árbol.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 }
});
