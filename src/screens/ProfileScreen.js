// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ onLogout }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const STORAGE_KEY = 'userProfile';

  useEffect(() => {
    // Cargar perfil guardado
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          setName(p.name || '');
          setAvatar(p.avatar || null);
        }
      } catch (e) {
        console.error('Error leyendo perfil', e);
      }
    })();
  }, []);

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos permiso para acceder a la galería.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setAvatar(res.assets[0].uri);
    }
  };

  const takeAvatarPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos permiso para la cámara.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setAvatar(res.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      const profile = { name: name.trim(), avatar };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      Alert.alert('Perfil guardado', 'Tu perfil se ha guardado correctamente.');
    } catch (e) {
      console.error('Error guardando perfil', e);
      Alert.alert('Error', 'No se pudo guardar el perfil.');
    }
  };

  const handleLogout = async () => {
    // opcional: limpiar datos locales al cerrar sesión
    // await AsyncStorage.removeItem('userProfile');
    if (onLogout) onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Mi Perfil</Text>

      <View style={styles.avatarWrap}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={{ color: '#666' }}>Sin foto</Text>
          </View>
        )}
      </View>

      <View style={styles.rowButtons}>
        <Button title="📸 Tomar foto" onPress={takeAvatarPhoto} />
        <Button title="🖼️ Galería" onPress={pickImageFromLibrary} />
      </View>

      <TextInput
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <View style={{ width: '100%', marginTop: 10 }}>
        <Button title="Guardar perfil" onPress={saveProfile} />
      </View>

      <View style={{ width: '100%', marginTop: 12 }}>
        <Button title="Cerrar sesión" color="#E53935" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#eee' },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
  },
});
