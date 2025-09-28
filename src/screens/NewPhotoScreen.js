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

export default function NewPhotoScreen({ navigation }) {
  const [mode, setMode] = useState(null); // null, 'single', 'multiple'
  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const multipleSteps = [
    { name: "Vista Principal", instruction: "Foto general de la planta" },
    { name: "Detalle Hojas", instruction: "Acércate a las hojas" },
    { name: "Tronco/Tallo", instruction: "Foto del tronco o tallo principal" },
    { name: "Vista Lateral", instruction: "Foto desde un lado" }
  ];

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

  const startQuickMode = async () => {
    setMode('single');
    await takePhoto();
  };

  const startDetailedMode = () => {
    setMode('multiple');
    setCurrentStep(0);
    setImages([]);
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          step: mode === 'multiple' ? currentStep : 0,
          type: mode === 'multiple' ? multipleSteps[currentStep]?.name || 'multiple' : 'single'
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);

        if (mode === 'multiple') {
          if (currentStep < multipleSteps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            // Completado el modo múltiple
            await analyzeImages(updatedImages);
          }
        } else {
          // Modo simple: analizar inmediatamente
          await analyzeImages(updatedImages);
        }
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto. Intenta de nuevo.");
    }
  };

  const pickFromGallery = async () => {
    try {
      setMode('single');
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          step: 0,
          type: 'gallery'
        };

        const updatedImages = [newImage];
        setImages(updatedImages);
        await analyzeImages(updatedImages);
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const analyzeImages = async (imagesToAnalyze) => {
    try {
      setIsAnalyzing(true);
      
      // Usar la misma función de análisis que ScanAI
      const plantMode = imagesToAnalyze.length > 1 ? 'big' : 'single';
      const analysisResult = await analyzePhotosWithPlantNet(
        imagesToAnalyze.map(img => img.uri), 
        plantMode
      );
      
      setAnalysis(analysisResult);
      
      // Guardar en el sistema como las otras plantas
      await saveAnalyzedPlant(imagesToAnalyze, analysisResult);
      
    } catch (error) {
      console.error("Error analizando imágenes:", error);
      Alert.alert("Error", "No se pudo analizar la imagen. Intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveAnalyzedPlant = async (imagesToSave, analysisResult) => {
    try {
      const newTree = {
        id: Date.now(),
        mode: imagesToSave.length > 1 ? "multiple" : "single",
        photos: imagesToSave.map(img => img.uri),
        analysis: analysisResult,
        createdAt: new Date().toISOString(),
        source: "NewPhoto"
      };

      const stored = await AsyncStorage.getItem("myTrees");
      const trees = stored ? JSON.parse(stored) : [];
      trees.unshift(newTree);
      await AsyncStorage.setItem("myTrees", JSON.stringify(trees));

      // También guardar como lastPhoto para compatibilidad
      await AsyncStorage.setItem("lastPhoto", imagesToSave[0].uri);
      
    } catch (error) {
      console.error("Error guardando planta:", error);
    }
  };

  const resetSession = () => {
    setImages([]);
    setCurrentStep(0);
    setAnalysis(null);
    setMode(null);
  };

  const viewResults = () => {
    navigation.navigate('Trees');
    resetSession();
  };

  // Pantalla de selección de modo
  if (!mode && images.length === 0 && !analysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📷 Nueva Foto</Text>
          <Text style={styles.subtitle}>
            Elige cómo quieres capturar tu planta para obtener el mejor análisis
          </Text>
        </View>

        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={[styles.modeCard, styles.quickMode]}
            onPress={startQuickMode}
          >
            <Ionicons name="camera" size={32} color="#2e7d32" />
            <Text style={styles.modeTitle}>Foto Rápida</Text>
            <Text style={styles.modeDescription}>
              Una sola foto para identificación básica
            </Text>
            <View style={styles.modeFeatures}>
              <Text style={styles.feature}>• Identificación instantánea</Text>
              <Text style={styles.feature}>• Consejos básicos de cuidado</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modeCard, styles.detailedMode]}
            onPress={startDetailedMode}
          >
            <Ionicons name="images" size={32} color="#1976d2" />
            <Text style={styles.modeTitle}>Análisis Detallado</Text>
            <Text style={styles.modeDescription}>
              Múltiples fotos para análisis completo
            </Text>
            <View style={styles.modeFeatures}>
              <Text style={styles.feature}>• {multipleSteps.length} fotos guiadas</Text>
              <Text style={styles.feature}>• Análisis completo de poda</Text>
              <Text style={styles.feature}>• Consejos personalizados</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
          <Ionicons name="folder-open" size={20} color="#2e7d32" />
          <Text style={styles.galleryButtonText}>Seleccionar de Galería</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de captura (modo múltiple)
  if (mode === 'multiple' && currentStep < multipleSteps.length && !analysis) {
    const step = multipleSteps[currentStep];
    
    return (
      <View style={styles.captureContainer}>
        <View style={styles.captureHeader}>
          <TouchableOpacity onPress={resetSession}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.stepCounter}>
            {currentStep + 1} de {multipleSteps.length}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / multipleSteps.length) * 100}%` }
            ]} 
          />
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.stepTitle}>{step.name}</Text>
          <Text style={styles.stepInstruction}>{step.instruction}</Text>
        </View>

        <View style={styles.captureArea}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Ionicons name="camera" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={styles.thumbnailRow}>
            <Text style={styles.thumbnailTitle}>Fotos capturadas:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((img, index) => (
                <Image key={index} source={{ uri: img.uri }} style={styles.thumbnail} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  // Pantalla de análisis
  if (isAnalyzing) {
    return (
      <View style={styles.analysisContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.analysisTitle}>Analizando tu planta...</Text>
        <Text style={styles.analysisSubtitle}>
          Identificando especie y generando consejos personalizados
        </Text>
      </View>
    );
  }

  // Pantalla de resultados
  if (analysis) {
    return (
      <ScrollView style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>¡Análisis Completado!</Text>
          <TouchableOpacity onPress={resetSession} style={styles.newAnalysisButton}>
            <Ionicons name="add" size={20} color="#2e7d32" />
            <Text style={styles.newAnalysisText}>Nueva Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Fotos capturadas */}
        <View style={styles.photosSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <View key={index} style={styles.resultPhoto}>
                <Image source={{ uri: img.uri }} style={styles.resultImage} />
                <Text style={styles.photoType}>{img.type}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Resultados del análisis */}
        <View style={styles.analysisCard}>
          <Text style={styles.speciesName}>{analysis.species}</Text>
          <Text style={styles.confidence}>
            Confianza: {(analysis.confidence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.description}>{analysis.description}</Text>
        </View>

        {/* Consejos de poda */}
        {analysis.pruningAdvice && (
          <View style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>✂️ Consejos de Poda</Text>
            <Text style={styles.pruningType}>{analysis.pruningAdvice.type}</Text>
            <Text style={styles.pruningSeason}>Época: {analysis.pruningAdvice.season}</Text>
            
            {analysis.pruningAdvice.actions && (
              <View style={styles.actionsList}>
                {analysis.pruningAdvice.actions.slice(0, 3).map((action, index) => (
                  <Text key={index} style={styles.actionItem}>• {action}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.viewTreesButton} onPress={viewResults}>
            <Ionicons name="leaf" size={20} color="#fff" />
            <Text style={styles.viewTreesText}>Ver en Mis Árboles</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Fallback
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f5",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  modeSelector: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  modeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickMode: {
    borderWidth: 2,
    borderColor: "#2e7d32",
  },
  detailedMode: {
    borderWidth: 2,
    borderColor: "#1976d2",
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  modeFeatures: {
    alignItems: "flex-start",
  },
  feature: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  galleryButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  captureContainer: {
    flex: 1,
    backgroundColor: "#f0f8f5",
  },
  captureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },
  stepCounter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 2,
  },
  instructionCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: 8,
  },
  stepInstruction: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  captureArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#2e7d32",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  thumbnailRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  thumbnailTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  analysisContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8f5",
    padding: 40,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2e7d32",
    marginTop: 20,
    marginBottom: 8,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: "#f0f8f5",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e7d32",
  },
  newAnalysisButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2e7d32",
  },
  newAnalysisText: {
    color: "#2e7d32",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  photosSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultPhoto: {
    alignItems: "center",
    marginRight: 12,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoType: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  analysisCard: {
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
  speciesName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 8,
  },
  confidence: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  adviceCard: {
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
  adviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  pruningType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2e7d32",
    marginBottom: 4,
  },
  pruningSeason: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  actionsList: {
    marginTop: 8,
  },
  actionItem: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 18,
  },
  actionButtons: {
    padding: 20,
  },
  viewTreesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
  },
  viewTreesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});