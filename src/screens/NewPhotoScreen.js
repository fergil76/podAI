import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewPhotoScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert("Permisos requeridos", "Se necesitan permisos de cámara y galería");
      }
    })();
  }, []);

  // Tomar foto con cámara
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Elegir desde galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Guardar publicación
  const savePost = async () => {
    if (!image) {
      Alert.alert("Error", "Debes tomar o elegir una foto primero");
      return;
    }

    try {
      const newPost = { image, text };
      const storedPosts = await AsyncStorage.getItem('communityPosts');
      const posts = storedPosts ? JSON.parse(storedPosts) : [];
      posts.unshift(newPost);
      await AsyncStorage.setItem('communityPosts', JSON.stringify(posts));

      setImage(null);
      setText('');
      navigation.navigate('Community');
    } catch (error) {
      console.error("Error guardando publicación", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="📸 Tomar foto" onPress={takePhoto} />
      <Button title="🖼️ Elegir de galería" onPress={pickImage} />

      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Escribe un comentario..."
            value={text}
            onChangeText={setText}
          />
          <Button title="✅ Publicar" onPress={savePost} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: '100%', height: 300, marginTop: 20, borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
