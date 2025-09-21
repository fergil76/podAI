// src/screens/ScanAIScreen.js
import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert, 
  Animated, 
  Vibration,
  ActivityIndicator,
  ScrollView 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ScanAIScreen({ navigation }) {
  const [mode, setMode] = useState(null); // "big" or "bonsai"
  const [stepIndex, setStepIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [hasPermissions, setHasPermissions] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Animaciones
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Instrucciones mejoradas con iconos y posicionamiento
  const stepsBigTree = [
    { name: "Vista Frontal", instruction: "Coloca el árbol en el centro, vista completa", icon: "camera-outline", position: "center" },
    { name: "Lado Izquierdo", instruction: "Muévete 90° hacia la izquierda", icon: "arrow-back", position: "left" },
    { name: "Lado Derecho", instruction: "Muévete 90° hacia la derecha desde el frente", icon: "arrow-forward", position: "right" },
    { name: "Vista Trasera", instruction: "Posiciónate detrás del árbol", icon: "refresh", position: "back" },
    { name: "Ángulo Superior", instruction: "Inclina la cámara hacia arriba (copa)", icon: "arrow-up", position: "top" }
  ];

  const stepsBonsai = [
    { name: "Vista Frontal", instruction: "Centra el bonsái en la pantalla", icon: "camera-outline", position: "center" },
    { name: "Lado Izquierdo", instruction: "Rota 60° hacia la izquierda", icon: "arrow-back", position: "left" },
    { name: "Lado Derecho", instruction: "Rota 60° hacia la derecha", icon: "arrow-forward", position: "right" },
    { name: "Vista Trasera", instruction: "Gira 180° para ver la parte posterior", icon: "refresh", position: "back" },
    { name: "Vista Superior", instruction: "Foto desde arriba del bonsái", icon: "arrow-up", position: "top" },
    { name: "Detalle Base", instruction: "Acércate al tronco y nebari", icon: "arrow-down", position: "detail" }
  ];

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

  useEffect(() => {
    // Animación de pulso para el botón de captura
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    
    if (mode && !showAnalysis) {
      pulseAnimation();
    }
  }, [mode, showAnalysis]);

  useEffect(() => {
    // Actualizar barra de progreso
    if (mode && steps.length > 0) {
      Animated.timing(progressAnim, {
        toValue: stepIndex / steps.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [stepIndex, mode]);

  const resetAll = () => {
    setPhotos([]);
    setStepIndex(0);
    setMode(null);
    setShowAnalysis(false);
    setAnalysisResult(null);
  };

  const mockAnalyzePhotos = (photosArray, plantMode) => {
    const analysisData = {
      big: {
        species: "Almendro (Prunus dulcis)",
        confidence: 0.94,
        health: "Excelente",
        pruningAdvice: {
          season: "Invierno (Enero-Febrero)",
          type: "Poda de fructificación",
          actions: [
            "Eliminar ramas secas y dañadas",
            "Aclarar el centro para ventilación",
            "Recortar brotes verticales",
            "Equilibrar ramas principales"
          ],
          benefits: "Mejora producción y salud del árbol"
        },
        reconstructionQuality: "Excelente - 5 ángulos capturados"
      },
      bonsai: {
        species: "Ficus Benjamina Bonsái",
        confidence: 0.91,
        health: "Muy bueno",
        pruningAdvice: {
          season: "Primavera-Verano",
          type: "Poda estética y de mantenimiento",
          actions: [
            "Pinzado de brotes nuevos",
            "Eliminar hojas grandes",
            "Equilibrar silueta",
            "Defoliado parcial si necesario"
          ],
          benefits: "Mantiene forma y estimula ramificación"
        },
        reconstructionQuality: "Excelente - 6 ángulos completos"
      }
    };

    return analysisData[plantMode] || analysisData.big;
  };

  const takePhoto = async () => {
    if (!hasPermissions) {
      Alert.alert("Permisos", "Permisos de cámara no concedidos.");
      return;
    }

    setIsCapturing(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const photoWithMetadata = {
          uri,
          step: stepIndex,
          angle: steps[stepIndex].position,
          timestamp: new Date().toISOString(),
        };
        
        const newPhotos = [...photos, photoWithMetadata];
        setPhotos(newPhotos);

        // Vibración de confirmación
        Vibration.vibrate(100);

        // Si quedan pasos -> avanzar, si es el último -> analizar
        if (stepIndex + 1 < steps.length) {
          setStepIndex(stepIndex + 1);
        } else {
          // Finalizado: mostrar análisis
          setShowAnalysis(true);
          
          // Simular tiempo de análisis
          setTimeout(() => {
            const analysis = mockAnalyzePhotos(newPhotos, mode);
            setAnalysisResult(analysis);
          }, 2500);
        }
      }
    } catch (error) {
      console.error("takePhoto error", error);
      Alert.alert("Error", "No se pudo tomar la foto. Intenta de nuevo.");
    } finally {
      setIsCapturing(false);
    }
  };

  const saveScanAndReset = async (photosArray, analysis) => {
    try {
      const newTree = {
        id: Date.now(),
        mode: mode || "unknown",
        photos: photosArray,
        analysis: analysis,
        createdAt: new Date().toISOString(),
      };

      const raw = await AsyncStorage.getItem("myTrees");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(newTree);
      await AsyncStorage.setItem("myTrees", JSON.stringify(arr));

      Alert.alert(
        "¡Análisis completado! 🌳",
        `${analysis.species} identificado con ${(analysis.confidence * 100).toFixed(1)}% de confianza.`,
        [
          {
            text: "Ver en Mis Árboles",
            onPress: () => {
              resetAll();
              try {
                navigation.navigate("MainTabs", { screen: "Trees" });
              } catch (e) {
                navigation.navigate("Trees");
              }
            },
          },
          {
            text: "Nuevo Escaneo",
            onPress: () => resetAll(),
          }
        ]
      );
    } catch (err) {
      console.error("saveScan error", err);
      Alert.alert("Error", "No se pudo guardar el escaneo.");
    }
  };

  const getPriorityColor = (index) => {
    const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"];
    return colors[index % colors.length];
  };

  // Pantalla de selección de modo
  if (!mode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="scan" size={48} color="#2e7d32" />
          <Text style={styles.title}>🤖 Escaneo IA Avanzado</Text>
          <Text style={styles.subtitle}>Selecciona el tipo de planta para obtener el mejor análisis</Text>
        </View>

        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, styles.bigTreeMode]} 
            onPress={() => setMode("big")}
          >
            <View style={styles.modeHeader}>
              <Ionicons name="tree" size={32} color="#16A34A" />
              <Text style={styles.modeTitle}>Árbol Grande / Seto</Text>
            </View>
            <Text style={styles.modeDescription}>
              Perfecto para árboles frutales, ornamentales y setos
            </Text>
            <Text style={styles.modeSteps}>📸 {stepsBigTree.length} fotos requeridas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modeButton, styles.bonsaiMode]} 
            onPress={() => setMode("bonsai")}
          >
            <View style={styles.modeHeader}>
              <Ionicons name="leaf" size={32} color="#059669" />
              <Text style={styles.modeTitle}>Bonsái / Planta Pequeña</Text>
            </View>
            <Text style={styles.modeDescription}>
              Ideal para bonsáis, plantas de interior y macetas
            </Text>
            <Text style={styles.modeSteps}>📸 {stepsBonsai.length} fotos requeridas</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#6B7280" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de análisis
  if (showAnalysis) {
    return (
      <View style={styles.container}>
        <View style={styles.analysisHeader}>
          <Text style={styles.analysisTitle}>
            {analysisResult ? "✅ Análisis Completado" : "🔄 Analizando..."}
          </Text>
          <Text style={styles.analysisSubtitle}>
            {analysisResult 
              ? `Procesando modelo 3D de ${photos.length} fotos`
              : "Procesando imágenes con IA..."
            }
          </Text>
        </View>

        {!analysisResult ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={styles.loadingText}>
              Identificando especie y generando recomendaciones...
            </Text>
            <View style={styles.loadingSteps}>
              <Text style={styles.loadingStep}>🔍 Analizando características visuales</Text>
              <Text style={styles.loadingStep}>🌿 Identificando especie</Text>
              <Text style={styles.loadingStep}>🧠 Generando consejos de poda</Text>
            </View>
          </View>
        ) : (
          <ScrollView style={styles.resultsContainer}>
            {/* Carrusel de fotos */}
            <View style={styles.photosSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoPreview}>
                    <Image source={{ uri: photo.uri }} style={styles.previewImage} />
                    <Text style={styles.photoLabel}>{steps[index].name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Resultados del análisis */}
            <View style={styles.resultCard}>
              <Text style={styles.speciesTitle}>🌳 {analysisResult.species}</Text>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confianza del análisis:</Text>
                <View style={styles.confidenceBar}>
                  <View 
                    style={[styles.confidenceFill, { width: `${analysisResult.confidence * 100}%` }]} 
                  />
                </View>
                <Text style={styles.confidenceText}>
                  {(analysisResult.confidence * 100).toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.healthStatus}>
                <Ionicons name="fitness" size={20} color="#10B981" />
                <Text style={styles.healthText}>Estado: {analysisResult.health}</Text>
              </View>

              <Text style={styles.reconstructionInfo}>
                📐 {analysisResult.reconstructionQuality}
              </Text>
            </View>

            {/* Consejos de poda */}
            <View style={styles.adviceCard}>
              <Text style={styles.adviceTitle}>✂️ Plan de Poda Recomendado</Text>
              
              <View style={styles.pruningHeader}>
                <Text style={styles.pruningType}>{analysisResult.pruningAdvice.type}</Text>
                <View style={styles.seasonBadge}>
                  <Ionicons name="calendar" size={16} color="#16A34A" />
                  <Text style={styles.seasonText}>{analysisResult.pruningAdvice.season}</Text>
                </View>
              </View>

              <Text style={styles.adviceDescription}>
                {analysisResult.pruningAdvice.benefits}
              </Text>

              <Text style={styles.actionsTitle}>Acciones específicas:</Text>
              {analysisResult.pruningAdvice.actions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <View style={[styles.actionDot, { backgroundColor: getPriorityColor(index) }]} />
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        <View style={styles.analysisButtons}>
          {analysisResult && (
            <>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={() => saveScanAndReset(photos, analysisResult)}
              >
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Guardar Análisis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.newScanButton} 
                onPress={resetAll}
              >
                <Ionicons name="refresh" size={20} color="#2e7d32" />
                <Text style={styles.newScanButtonText}>Nuevo Escaneo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  // Pantalla de captura guiada
  const currentStep = steps[stepIndex];

  return (
    <View style={styles.container}>
      {/* Header con progreso */}
      <View style={styles.captureHeader}>
        <TouchableOpacity onPress={resetAll} style={styles.cancelButton}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <View style={styles.progressInfo}>
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }
              ]} 
            />
          </View>
          <Text style={styles.stepCounter}>
            {stepIndex + 1} de {steps.length}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Instrucciones */}
      <View style={styles.instructionCard}>
        <Ionicons name={currentStep.icon} size={48} color="#2e7d32" />
        <Text style={styles.stepTitle}>{currentStep.name}</Text>
        <Text style={styles.stepInstruction}>{currentStep.instruction}</Text>
      </View>

      {/* Vista previa de fotos capturadas */}
      {photos.length > 0 && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>✅ Fotos capturadas ({photos.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo.uri }} style={styles.miniThumb} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Botón de captura principal */}
      <View style={styles.captureSection}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity 
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]} 
            onPress={takePhoto}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size={32} color="#fff" />
            ) : (
              <Ionicons name="camera" size={32} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <Text style={styles.captureButtonText}>
          {isCapturing ? "Capturando..." : `Foto ${stepIndex + 1}/${steps.length}`}
        </Text>
      </View>

      {/* Botones secundarios */}
      <View style={styles.secondaryButtons}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => {
            if (stepIndex + 1 < steps.length) {
              setStepIndex(stepIndex + 1);
            } else {
              if (photos.length > 0) {
                setShowAnalysis(true);
                setTimeout(() => {
                  const analysis = mockAnalyzePhotos(photos, mode);
                  setAnalysisResult(analysis);
                }, 2500);
              } else {
                Alert.alert("Atención", "No hay fotos para analizar.");
              }
            }
          }}
          disabled={isCapturing}
        >
          <Ionicons name="play-skip-forward" size={20} color="#6B7280" />
          <Text style={styles.skipButtonText}>Saltar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resetStepButton} 
          onPress={() => {
            Alert.alert("Reiniciar escaneo", "¿Quieres reiniciar el escaneo completo?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Reiniciar", style: "destructive", onPress: resetAll },
            ]);
          }}
          disabled={isCapturing}
        >
          <Ionicons name="refresh" size={20} color="#EF4444" />
          <Text style={styles.resetStepButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f6fff7" 
  },
  
  // Estilos para selección de modo
  header: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#111827"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#6B7280", 
    textAlign: "center",
    lineHeight: 22,
  },
  modeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  modeButton: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 16, 
    marginVertical: 12, 
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bigTreeMode: {
    borderColor: "#16A34A",
  },
  bonsaiMode: {
    borderColor: "#059669",
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modeTitle: { 
    color: "#111827", 
    fontWeight: "700", 
    fontSize: 18,
    marginLeft: 12,
    flex: 1,
  },
  modeDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  modeSteps: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#6B7280",
  },

  // Estilos para captura
  captureHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  cancelButton: {
    padding: 8,
  },
  progressInfo: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "rgba(46, 125, 50, 0.2)",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 2,
  },
  stepCounter: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  instructionCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  stepInstruction: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  previewSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  miniThumb: { 
    width: 60, 
    height: 60, 
    marginRight: 8, 
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  captureSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  captureButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  captureButtonText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  resetStepButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetStepButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#EF4444",
  },

  // Estilos para análisis
  analysisHeader: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  analysisTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  analysisSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#374151",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  loadingSteps: {
    alignItems: "flex-start",
  },
  loadingStep: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photosSection: {
    marginBottom: 20,
  },
  photoPreview: {
    alignItems: "center",
    marginRight: 12,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  photoLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  speciesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 4,
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#16A34A",
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
    textAlign: "right",
  },
  healthStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  healthText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  reconstructionInfo: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  adviceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  pruningHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pruningType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#16A34A",
    flex: 1,
  },
  seasonBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  seasonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#16A34A",
  },
  adviceDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  analysisButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 8,
  },
  saveButtonText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  newScanButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2e7d32",
    marginLeft: 8,
  },
  newScanButtonText: {
    marginLeft: 8,
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
  },
});