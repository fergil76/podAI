import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getNotificationSummary } from "../utils/seasonalNotifications";

export default function HomeScreen({ navigation }) {
  const [notificationSummary, setNotificationSummary] = useState(null);

  useEffect(() => {
    loadNotificationSummary();
    
    // Actualizar notificaciones cuando la pantalla se enfoque
    const unsubscribe = navigation.addListener('focus', loadNotificationSummary);
    return unsubscribe;
  }, [navigation]);

  const loadNotificationSummary = async () => {
    try {
      const summary = await getNotificationSummary();
      setNotificationSummary(summary);
    } catch (error) {
      console.error('Error cargando resumen de notificaciones:', error);
    }
  };

  const navigateToNotifications = () => {
    navigation.navigate("Notifications");
  };

  return (
    <View style={styles.container}>
      {/* Header con notificaciones */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🌱 Bienvenido a PodAI</Text>
          <Text style={styles.subtitle}>
            Tu asistente inteligente para el cuidado y poda de bonsáis y arbustos
          </Text>
        </View>
        
        {/* Botón de notificaciones con badge */}
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={navigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color="#2e7d32" />
          {notificationSummary?.total > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {notificationSummary.total > 9 ? '9+' : notificationSummary.total}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Alerta de notificaciones urgentes */}
      {notificationSummary?.highPriority > 0 && (
        <TouchableOpacity 
          style={styles.urgentAlert}
          onPress={navigateToNotifications}
        >
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text style={styles.urgentText}>
            {notificationSummary.highPriority} acción{notificationSummary.highPriority > 1 ? 'es' : ''} urgente{notificationSummary.highPriority > 1 ? 's' : ''} de poda
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#EF4444" />
        </TouchableOpacity>
      )}

      {/* Botones principales */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Trees")}
      >
        <Text style={styles.buttonText}>🌳 Mis Árboles</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ScanIA")}
      >
        <Text style={styles.buttonText}>🤖 Escaneo IA</Text>
      </TouchableOpacity>

      {/* Botón de notificaciones destacado */}
      <TouchableOpacity
        style={[
          styles.button,
          notificationSummary?.total > 0 && styles.notificationHighlight
        ]}
        onPress={navigateToNotifications}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            📅 Cuidados Estacionales
          </Text>
          {notificationSummary?.total > 0 && (
            <View style={styles.inlineBadge}>
              <Text style={styles.inlineBadgeText}>{notificationSummary.total}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Community")}
      >
        <Text style={styles.buttonText}>🌍 Comunidad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>👤 Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f5",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "left",
    color: "#555",
    lineHeight: 22,
    maxWidth: "85%",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  urgentAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  urgentText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHighlight: {
    backgroundColor: "#2e7d32",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  inlineB‌adge: {
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  inlineBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});