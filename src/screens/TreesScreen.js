import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TreesScreen({ navigation, route }) {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    const loadTrees = async () => {
      const storedTrees = await AsyncStorage.getItem("scannedTrees");
      if (storedTrees) {
        setTrees(JSON.parse(storedTrees));
      }
    };

    loadTrees();
  }, [route.params]);

  // Guardamos nuevas fotos escaneadas
  useEffect(() => {
    if (route.params?.scannedPhotos) {
      const newTrees = [...trees, ...route.params.scannedPhotos];
      setTrees(newTrees);
      AsyncStorage.setItem("scannedTrees", JSON.stringify(newTrees));
    }
  }, [route.params?.scannedPhotos]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌳 Mis Árboles</Text>

      {trees.length === 0 ? (
        <Text style={styles.subtitle}>Aún no has escaneado ningún árbol.</Text>
      ) : (
        <View style={styles.grid}>
          {trees.map((uri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("TreeDetail", { photoUri: uri })}
            >
              <Image source={{ uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f8f5",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  subtitle: { fontSize: 16, color: "#555" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  image: { width: 100, height: 100, margin: 5, borderRadius: 8 },
});
