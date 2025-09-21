// src/screens/ScanAIScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ScanAIScreen({ navigation }) {
  const [mode, setMode] = useState(null); // "big" or "bonsai"
  const [stepIndex, setStepIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [hasPermissions, setHasPermissions] = useState(true);

  const stepsBigTree = ["Frontal", "Izquierda", "Derecha", "Atrás", "Ángulo extra"];
  const stepsBonsai  = ["Frontal", "Izquierda", "Derecha", "Atrás", "Arriba", "Ángulo extra"];

  const steps = mode === "big" ? stepsBigTree : stepsBonsai;

  useEffect(() => {
    (async () => {
      try {
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cam.status !== "granted" || media.status !== "granted") {
          setHasPermissions(false);
          Alert.alert("Permisos", "Necesitamos permisos de cámara y galería para el escaneo IA.");
        } else {
          setHasPermissions(true);
        }
      } catch (err) {
        console.error("perm error", err);
        setHasPermissions(false);
      }
    })();
  }, []);

  const resetAll = () => {
    setPhotos([]);
    setStepIndex(0);
    setMode(null);
  };

  const takePhoto = async () => {
    if (!hasPermissions) {
      Alert.alert("Permisos", "Permisos de cámara no concedidos.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const newPhotos = [...photos, uri];
        setPhotos(newPhotos);

        // si quedan pasos -> avanzar, si es el ultimo -> guardar y reset
        if (stepIndex + 1 < steps.length) {
          setStepIndex(stepIndex + 1);
        } else {
          // finalizado: guardamos y reiniciamos
          await saveScanAndReset(newPhotos);
        }
      }
    } catch (error) {
      console.error("takePhoto error", error);
      Alert.alert("Error", "No se pudo tomar la foto. Intenta de nuevo.");
    }
  };

  const saveScanAndReset = async (photosArray) => {
    try {
      const newTree = {
        id: Date.now(),
        mode: mode || "unknown",
        photos: photosArray,
        createdAt: new Date().toISOString(),
      };

      const raw = await AsyncStorage.getItem("myTrees");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(newTree);
      await AsyncStorage.setItem("myTrees", JSON.stringify(arr));

      // Mensaje y reset
      Alert.alert(
        "Escaneo completado",
        "Tus fotos se han guardado en Mis Árboles.",
        [
          {
            text: "Ver Mis Árboles",
            onPress: () => {
              resetAll();
              // Navegamos a la pestaña Trees dentro del MainTabs / Tabs.
              // Intentamos dos formas por compatibilidad:
              try {
                navigation.navigate("Main", { screen: "Trees" });
              } catch (e) {
                navigation.navigate("Trees");
              }
            },
          },
        ]
      );
    } catch (err) {
      console.error("saveScan error", err);
      Alert.alert("Error", "No se pudo guardar el escaneo.");
    }
  };

  // Si no ha elegido modo, mostramos selector
  if (!mode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona tipo de planta</Text>
        <TouchableOpacity style={styles.modeButton} onPress={() => setMode("big")}>
          <Text style={styles.modeText}>🌳 Árbol grande / seto (5 fotos)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modeButton} onPress={() => setMode("bonsai")}>
          <Text style={styles.modeText}>🌱 Bonsái / planta pequeña (6 fotos)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghost} onPress={() => { navigation.goBack(); }}>
          <Text style={{ color: "#2e7d32" }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Modo activo: guiado paso a paso
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Escaneo IA</Text>
      <Text style={styles.subtitle}>Modo: {mode === "big" ? "Árbol grande" : "Bonsái"}</Text>
      <Text style={styles.instruction}>
        Paso {stepIndex + 1} de {steps.length}
      </Text>
      <Text style={styles.instructionDetail}>📷 {steps[stepIndex]}</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
        <Text style={styles.primaryText}>Tomar foto ({stepIndex + 1}/{steps.length})</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghost} onPress={() => {
        // opción: saltar este paso si por algún motivo no se puede tomar
        if (stepIndex + 1 < steps.length) {
          setStepIndex(stepIndex + 1);
        } else {
          // si era el último, guardamos lo que haya
          if (photos.length > 0) saveScanAndReset(photos);
          else Alert.alert("Atención", "No hay fotos para guardar.");
        }
      }}>
        <Text style={{ color: "#2e7d32" }}>No puedo tomar esta foto → saltar</Text>
      </TouchableOpacity>

      <View style={styles.previewRow}>
        {photos.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.thumb} />
        ))}
      </View>

      <TouchableOpacity style={styles.reset} onPress={() => {
        Alert.alert("Reiniciar escaneo", "¿Quieres reiniciar el escaneo actual?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Reiniciar", style: "destructive", onPress: resetAll },
        ]);
      }}>
        <Text style={{ color: "#999" }}>Reiniciar escaneo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f6fff7" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 12 },
  instruction: { fontSize: 16, fontWeight: "600" },
  instructionDetail: { fontSize: 15, color: "#444", marginVertical: 10, textAlign: "center" },
  primaryButton: { backgroundColor: "#2e7d32", paddingVertical: 14, paddingHorizontal: 22, borderRadius: 10, marginTop: 12 },
  primaryText: { color: "#fff", fontWeight: "700" },
  modeButton: { backgroundColor: "#fff", padding: 14, borderRadius: 10, width: "100%", alignItems: "center", marginVertical: 8, borderWidth: 1, borderColor: "#ddd" },
  modeText: { color: "#2e7d32", fontWeight: "700" },
  ghost: { marginTop: 12 },
  previewRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 18, justifyContent: "center" },
  thumb: { width: 80, height: 80, margin: 6, borderRadius: 8 },
  reset: { marginTop: 16 },
});
