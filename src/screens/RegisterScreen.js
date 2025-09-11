import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión", [
      { text: "OK", onPress: () => navigation.replace("Login") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta 🌱</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.icon} />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#f9fafb' },
  title: { fontSize:28, fontWeight:'700', marginBottom:28, textAlign:'center', color:'#16A34A' },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  icon: { marginRight: 6 },
  input: { flex: 1, height: 45 },
  button: { backgroundColor:'#16A34A', padding:14, borderRadius:10, alignItems:'center', marginTop:12 },
  buttonText: { color:'#fff', fontWeight:'700', fontSize:16 },
  link: { marginTop:15, color:'#16A34A', textAlign:'center' }
});
