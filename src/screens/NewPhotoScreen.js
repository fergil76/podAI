import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { analyzePhotosWithPlantNet } from "../utils/photoAnalysis";

export default function QuickPhotoScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== "granted" || mediaPermission.status !== "granted") {
      Alert.alert("Permisos requeridos", "Necesitamos acceso a la cámara y galería para continuar.");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        await analyzeQuickPhoto(imageUri);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto. Intenta de nuevo.");
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        await analyzeQuickPhoto(imageUri);
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const analyzeQuickPhoto = async (imageUri) => {
    try {
      setIsAnalyzing(true);
      
      // Análisis básico para identificación rápida
      const analysisResult = await analyzePhotosWithPlantNet([imageUri], 'quick');
      
      setAnalysis(analysisResult);
      
      // Guardar solo para historial básico
      await saveQuickPhoto(imageUri, analysisResult);
      
    } catch (error) {
      console.error("Error analizando imagen:", error);
      Alert.alert("Error", "No se pudo analizar la imagen. Intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveQuickPhoto = async (imageUri, analysisResult) => {
    try {
      // Guardar como lastPhoto para compatibilidad
      await AsyncStorage.setItem("lastPhoto", imageUri);
      
      // Guardar en historial simple (opcional, sin análisis completo)
      const quickHistory = await AsyncStorage.getItem("quickPhotoHistory");
      const history = quickHistory ? JSON.parse(quickHistory) : [];
      
      const quickEntry = {
        id: Date.now(),
        photo: imageUri,
        species: analysisResult.species,
        confidence: analysisResult.confidence,
        createdAt: new Date().toISOString(),
      };
      
      history.unshift(quickEntry);
      // Mantener solo las últimas 10 fotos rápidas
      const limitedHistory = history.slice(0, 10);
      await AsyncStorage.setItem("quickPhotoHistory", JSON.stringify(limitedHistory));
      
    } catch (error) {
      console.error("Error guardando foto rápida:", error);
    }
  };

  const resetSession = () => {
    setImage(null);
    setAnalysis(null);
  };

  const navigateToDetailedAnalysis = () => {
    Alert.alert(
      "Análisis Detallado",
      "Para obtener consejos completos de poda, usa 'Escaneo IA' que analiza múltiples fotos.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Ir a Escaneo IA", 
          onPress: () => {
            resetSession();
            navigation.navigate('ScanIA');
          }
        }
      ]
    );
  };

  // Pantalla inicial
  if (!image && !analysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📷 Foto Rápida</Text>
          <Text style={styles.subtitle}>
            Identificación y cuidados básicos
          </Text>
        </View>

        <View style={styles.mainOptions}>
          <TouchableOpacity style={styles.cameraOption} onPress={takePhoto}>
            <View style={styles.optionIcon}>
              <Ionicons name="camera" size={48} color="#2e7d32" />
            </View>
            <Text style={styles.optionTitle}>Tomar Foto</Text>
            <Text style={styles.optionDescription}>
              Toma una única foto para un análisis básico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryOption} onPress={pickFromGallery}>
            <View style={styles.optionIcon}>
              <Ionicons name="images" size={48} color="#1976d2" />
            </View>
            <Text style={styles.optionTitle}>Seleccionar de Galería</Text>
            <Text style={styles.optionDescription}>
              Identificación rápida desde galería
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#f59e0b" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Foto Rápida vs Escaneo IA</Text>
            <Text style={styles.infoText}>
              • Foto Rápida: Identificación básica{'\n'}
              • Escaneo IA: Análisis completo + consejos de poda
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.detailedAnalysisLink} onPress={navigateToDetailedAnalysis}>
          <Text style={styles.detailedAnalysisText}>
            ¿Necesitas consejos de poda? Prueba Escaneo IA
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#2e7d32" />
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de análisis
  if (isAnalyzing) {
    return (
      <View style={styles.analysisContainer}>
        <Image source={{ uri: image }} style={styles.analyzingImage} />
        <ActivityIndicator size="large" color="#2e7d32" style={styles.loader} />
        <Text style={styles.analysisTitle}>Identificando tu planta...</Text>
        <Text style={styles.analysisSubtitle}>
          Analizando características visuales
        </Text>
      </View>
    );
  }

  // Pantalla de resultados
  if (analysis) {
    return (
      <ScrollView style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Identificación Completada</Text>
          <TouchableOpacity onPress={resetSession} style={styles.newPhotoButton}>
            <Ionicons name="camera" size={20} color="#2e7d32" />
            <Text style={styles.newPhotoText}>Nueva Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Foto capturada */}
        <View style={styles.photoSection}>
          <Image source={{ uri: image }} style={styles.resultImage} />
        </View>

        {/* Resultados básicos */}
        <View style={styles.identificationCard}>
          <View style={styles.speciesHeader}>
            <Text style={styles.speciesName}>{analysis.species}</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {(analysis.confidence * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
          
          <Text style={styles.description}>{analysis.description}</Text>
          
          {analysis.region && (
            <View style={styles.regionInfo}>
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text style={styles.regionText}>{analysis.region}</Text>
            </View>
          )}
        </View>

        {/* Información básica */}
        <View style={styles.basicInfoCard}>
          <Text style={styles.basicInfoTitle}>Información Básica</Text>
          <View style={styles.infoRow}>
            <Ionicons name="leaf" size={16} color="#2e7d32" />
            <Text style={styles.infoLabel}>Categoría:</Text>
            <Text style={styles.infoValue}>{analysis.category || 'No especificada'}</Text>
          </View>
          
          {analysis.pruningAdvice?.season && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={16} color="#2e7d32" />
              <Text style={styles.infoLabel}>Época de poda:</Text>
              <Text style={styles.infoValue}>{analysis.pruningAdvice.season}</Text>
            </View>
          )}
        </View>

        {/* Call to action para análisis detallado */}
        <View style={styles.upgradeCard}>
          <View style={styles.upgradeHeader}>
            <Ionicons name="trending-up" size={24} color="#1976d2" />
            <Text style={styles.upgradeTitle}>¿Quieres más información?</Text>
          </View>
          <Text style={styles.upgradeText}>
            Para obtener consejos detallados de poda, beneficios específicos y análisis completo, usa Escaneo IA.
          </Text>
          <TouchableOpacity style={styles.upgradeButton} onPress={navigateToDetailedAnalysis}>
            <Text style={styles.upgradeButtonText}>Ir a Escaneo IA</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={resetSession}>
            <Ionicons name="refresh" size={20} color="#2e7d32" />
            <Text style={styles.shareButtonText}>Otra Foto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  mainOptions: {
    gap: 20,
    marginBottom: 30,
  },
  cameraOption: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#e5f2e5",
  },
  galleryOption: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#e3f2fd",
  },
  optionIcon: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#a16207",
    lineHeight: 16,
  },
  detailedAnalysisLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  detailedAnalysisText: {
    fontSize: 14,
    color: "#2e7d32",
    fontWeight: "500",
    marginRight: 4,
  },
  analysisContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  analyzingImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 30,
  },
  loader: {
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  newPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2e7d32",
  },
  newPhotoText: {
    color: "#2e7d32",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  photoSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultImage: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
  },
  identificationCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  speciesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  speciesName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
    marginRight: 12,
  },
  confidenceBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  regionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  regionText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  basicInfoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  basicInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    flex: 1,
  },
  upgradeCard: {
    backgroundColor: "#f0f9ff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  upgradeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c4a6e",
    marginLeft: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: "#0369a1",
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  actionButtons: {
    padding: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2e7d32",
  },
  shareButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});