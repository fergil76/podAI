import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function NewPhotoScreen() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara para continuar.");
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem("lastPhoto", result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem("lastPhoto", result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Nueva Foto</Text>
      <Text style={styles.subtitle}>Toma una foto o selecciona una de tu galería.</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="images" size={24} color="white" />
          <Text style={styles.buttonText}>Galería</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Vista previa:</Text>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8f5", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20, textAlign: "center" },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: { color: "white", marginLeft: 8, fontSize: 16 },
  previewContainer: { marginTop: 20, alignItems: "center" },
  previewTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  image: { width: 250, height: 250, borderRadius: 15, resizeMode: "cover" },
});
