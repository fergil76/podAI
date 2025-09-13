// src/screens/ScanAIScreen.js
import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instructions = [
  "📸 Toma la foto frontal del árbol",
  "➡️ Ahora toma la foto del lado derecho",
  "⬅️ Ahora toma la foto del lado izquierdo",
  "🔄 Ahora toma la foto desde atrás",
  "⬆️ Ahora toma la foto desde arriba",
  "⬇️ Por último, toma la foto desde abajo",
];

export default function ScanAIScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newPhotos = [...photos, result.assets[0].uri];
      setPhotos(newPhotos);

      if (newPhotos.length === 6) {
        // Guardar en AsyncStorage como "escaneo completo"
        saveScan(newPhotos);
      }
    }
  };

  const saveScan = async (photosArray) => {
    try {
      const newScan = { photos: photosArray, date: new Date().toISOString() };
      const storedTrees = await AsyncStorage.getItem("trees");
      const trees = storedTrees ? JSON.parse(storedTrees) : [];
      trees.unshift(newScan);
      await AsyncStorage.setItem("trees", JSON.stringify(trees));

      setPhotos([]);
      navigation.navigate("Trees");
    } catch (error) {
      console.error("Error guardando escaneo IA", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escaneo IA</Text>
      <Text style={styles.instruction}>
        {instructions[photos.length] || "✅ Escaneo completo"}
      </Text>

      {photos.length < 6 ? (
        <Button title="📸 Tomar foto" onPress={takePhoto} />
      ) : (
        <Text style={styles.complete}>Procesando escaneo...</Text>
      )}

      <View style={styles.previewContainer}>
        {photos.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.preview} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  instruction: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  complete: { fontSize: 18, color: "green", marginTop: 20 },
  previewContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 20, justifyContent: "center" },
  preview: { width: 80, height: 80, margin: 5, borderRadius: 8 },
});
