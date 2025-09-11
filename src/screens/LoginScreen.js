import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput placeholder="Email" keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={() => alert("Login pendiente de implementar")}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:26, fontWeight:'700', marginBottom:18, textAlign:'center', color:'#0f172a' },
  input: { borderWidth:1, borderColor:'#e5e7eb', padding:12, marginBottom:12, borderRadius:8 },
  button: { backgroundColor:'#16A34A', padding:12, borderRadius:10, alignItems:'center', marginTop:8 },
  buttonText: { color:'#fff', fontWeight:'700' }
});
