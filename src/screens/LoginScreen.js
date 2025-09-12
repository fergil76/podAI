// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ onLogin, navigation, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí puedes añadir validaciones básicas si quieres
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Introduce email y contraseña');
      return;
    }

    // Simulamos login: llamamos al prop onLogin pasado desde App.js
    if (onLogin) {
      onLogin();
    } else {
      Alert.alert('Info', 'Función de login no disponible (onLogin no pasada)');
    }
  };

  const goToRegister = () => {
    // Si recibimos navigation (Stack props) usamos navigate
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Register');
      return;
    }
    // Si el padre pasó un callback para mostrar registro, lo usamos
    if (onShowRegister && typeof onShowRegister === 'function') {
      onShowRegister();
      return;
    }
    // Si no hay forma de navegar, avisamos
    Alert.alert('Info', 'No es posible navegar al registro desde aquí.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.buttonWrap}>
        <Button title="Entrar" onPress={handleLogin} />
      </View>

      <View style={styles.registerWrap}>
        <Text style={styles.registerText}>¿No tienes cuenta?</Text>
        <Button title="Crear cuenta" onPress={goToRegister} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  buttonWrap: { marginTop: 6, marginBottom: 10 },
  registerWrap: { marginTop: 18, alignItems: 'center' },
  registerText: { color: '#666', marginBottom: 6 },
});
