import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);

  // Cargar publicaciones guardadas al abrir la pantalla
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const storedPosts = await AsyncStorage.getItem('communityPosts');
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        }
      } catch (error) {
        console.error("Error cargando publicaciones", error);
      }
    };

    loadPosts();
  }, []);

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay publicaciones 🌱</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Image source={{ uri: item.image }} style={styles.image} />
              {item.text ? <Text style={styles.text}>{item.text}</Text> : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  post: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 },
  image: { width: '100%', height: 300, borderRadius: 10 },
  text: { marginTop: 10, fontSize: 14 },
});
