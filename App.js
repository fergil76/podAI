import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, Image, StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync(); // prevent auto hide until ready

const Stack = createNativeStackNavigator();

function mockIdentify() {
  const mockData = [
    { name: "Olivo", confidence: 0.92, advice: "Poda de limpieza cada 2 años, eliminar ramas secas." },
    { name: "Bonsái Ficus", confidence: 0.87, advice: "Poda estética ligera para mantener la forma." },
    { name: "Ciprés", confidence: 0.78, advice: "Poda de formación en primavera, controlar altura." },
    { name: "Seto de Laurel", confidence: 0.83, advice: "Poda de mantenimiento dos veces al año." }
  ];
  return mockData[Math.floor(Math.random() * mockData.length)];
}

function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.logo}>🌱 podAI</Text>
      <Text style={styles.subtitle}>Tu asistente inteligente de poda</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.primaryButtonText}>Comenzar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={[styles.center, { backgroundColor: "#F0FDF4" }]}>
      <Text style={styles.subtitle}>Selecciona una opción</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Camera")}>
        <Ionicons name="camera" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Tomar foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Perfil")}>
        <Ionicons name="images" size={20} color="#16A34A" style={{ marginRight: 8 }} />
        <Text style={styles.secondaryButtonText}>Ver Historial</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Solicitando permisos de cámara...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>Permiso denegado</Text></View>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      try {
        const stored = await AsyncStorage.getItem("photos");
        const photos = stored ? JSON.parse(stored) : [];
        photos.push(photo.uri);
        await AsyncStorage.setItem("photos", JSON.stringify(photos));
      } catch (e) {
        console.log("Error guardando foto", e);
      }
      navigation.navigate("Resultados", { photo });
    }
  };

  return (
    <Camera style={{ flex: 1 }} ref={cameraRef}>
      <View style={styles.cameraButton}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Ionicons name="camera" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

function ResultadosScreen({ route, navigation }) {
  const { photo } = route.params || {};
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setResult(mockIdentify());
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={[styles.center, { backgroundColor: "#F8FAFC" }]}>
      <Text style={styles.subtitle}>Resultados del análisis</Text>
      {photo && (
        <View style={styles.card}>
          <Image source={{ uri: photo.uri }} style={styles.resultImage} />
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" style={{ marginTop: 20 }} />
      ) : (
        result && (
          <View style={styles.card}>
            <Text style={styles.resultTitle}>🌳 {result.name}</Text>
            <Text style={styles.resultText}>Confianza: {(result.confidence * 100).toFixed(0)}%</Text>
            <Text style={styles.resultText}>💡 Consejo: {result.advice}</Text>
          </View>
        )
      )}
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.primaryButtonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function PerfilScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const stored = await AsyncStorage.getItem("photos");
        const photos = stored ? JSON.parse(stored) : [];
        setPhotos(photos.reverse());
      } catch (e) {
        console.log("Error cargando fotos", e);
      }
    };
    const unsubscribe = navigation.addListener("focus", loadPhotos);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.center, { backgroundColor: "#F9FAFB" }]}>
      <Text style={styles.subtitle}>Tu Historial</Text>
      {photos.length === 0 ? (
        <Text>No hay fotos aún.</Text>
      ) : (
        <FlatList
          data={photos}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.photoCard}>
              <Image source={{ uri: item }} style={styles.photo} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Resultados" component={ResultadosScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#374151"
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#16A34A"
  },
  secondaryButtonText: {
    color: "#16A34A",
    fontSize: 16,
    fontWeight: "600"
  },
  cameraButton: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40
  },
  captureButton: {
    backgroundColor: "#16A34A",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  resultImage: {
    width: 250,
    height: 300,
    borderRadius: 12
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827"
  },
  resultText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#374151"
  },
  photoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  photo: {
    width: 150,
    height: 180,
    borderRadius: 8
  }
});