import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const storedPosts = await AsyncStorage.getItem("communityPosts");
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        }
      } catch (error) {
        console.error("Error cargando publicaciones", error);
      }
    };

    // cargar al entrar en la pantalla
    loadPosts();

    // recargar cada vez que volvemos a la pantalla
    const interval = setInterval(loadPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.post} key={index}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text>No hay publicaciones todavía</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  post: { marginBottom: 20, alignItems: "center" },
  image: { width: "100%", height: 200, borderRadius: 10 },
  text: { marginTop: 10, fontSize: 16 },
});
