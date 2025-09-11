import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    // Usuario de prueba
    if (email === "test@test.com" && password === "1234") {
      navigation.replace("Home", { email });
    } else {
      Alert.alert("Error", "Email o contraseña incorrectos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PodAI</Text>
      <Text style={styles.subtitle}>Tu asistente de poda y cuidado de árboles 🌿</Text>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc"
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#475569",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6eef6",
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2
  },
  button: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#2563eb",
    fontSize: 14
  }
});
