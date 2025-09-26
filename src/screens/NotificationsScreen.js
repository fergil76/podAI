// src/screens/NotificationsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  generateSeasonalNotifications,
  getHighPriorityNotifications,
  getMonthlyRecommendations,
  markNotificationAsRead,
  isNotificationRead
} from '../utils/seasonalNotifications';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [monthlyRecommendations, setMonthlyRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [allNotifications, monthlyRecs] = await Promise.all([
        generateSeasonalNotifications(),
        getMonthlyRecommendations()
      ]);

      // Añadir estado de lectura a cada notificación
      const notificationsWithReadStatus = await Promise.all(
        allNotifications.map(async (notification) => ({
          ...notification,
          isRead: await isNotificationRead(notification.id)
        }))
      );

      setNotifications(notificationsWithReadStatus);
      setMonthlyRecommendations(monthlyRecs);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      // Marcar como leída
      await markNotificationAsRead(notification.id);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );

      // Mostrar detalles de la notificación
      Alert.alert(
        notification.title,
        `${notification.message}\n\n${getNotificationDetails(notification)}`,
        [
          {
            text: 'Ver mi planta',
            onPress: () => navigation.navigate('Trees')
          },
          {
            text: 'Entendido',
            style: 'default'
          }
        ]
      );
    } catch (error) {
      console.error('Error procesando notificación:', error);
    }
  };

  const getNotificationDetails = (notification) => {
    if (notification.type === 'pruning' && notification.details?.pruningAdvice) {
      const advice = notification.details.pruningAdvice;
      return `Tipo: ${advice.type}\nÉpoca: ${advice.season}\nBeneficios: ${advice.benefits?.[0] || 'Mejora la salud de la planta'}`;
    }
    return 'Consulta los detalles en tu perfil de plantas.';
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'information-circle';
      default: return 'checkmark-circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        notification.isRead && styles.readNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationHeader}>
        <Ionicons
          name={getPriorityIcon(notification.priority)}
          size={24}
          color={getPriorityColor(notification.priority)}
        />
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            notification.isRead && styles.readText
          ]}>
            {notification.title}
          </Text>
          <Text style={[
            styles.notificationMessage,
            notification.isRead && styles.readText
          ]}>
            {notification.message}
          </Text>
        </View>
        {!notification.isRead && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationDate}>
        {new Date(notification.createdAt).toLocaleDateString('es-ES')}
      </Text>
    </TouchableOpacity>
  );

  const renderMonthlyRecommendations = () => {
    if (!monthlyRecommendations) return null;

    return (
      <View style={styles.monthlySection}>
        <Text style={styles.sectionTitle}>
          📅 Recomendaciones de {monthlyRecommendations.month}
        </Text>
        
        {/* Consejos específicos del usuario */}
        {monthlyRecommendations.userSpecific?.length > 0 && (
          <View style={styles.userSpecificSection}>
            <Text style={styles.subsectionTitle}>Para tus plantas:</Text>
            {monthlyRecommendations.userSpecific.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <Text style={styles.speciesName}>{rec.species}</Text>
                <Text style={styles.recommendationText}>{rec.advice}</Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(rec.priority) }
                ]}>
                  <Text style={styles.priorityText}>
                    {rec.priority === 'high' ? 'Urgente' : 'Recomendado'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Consejos generales */}
        <View style={styles.generalSection}>
          <Text style={styles.subsectionTitle}>Consejo general:</Text>
          <View style={styles.generalAdviceCard}>
            <Text style={styles.generalAdviceText}>
              {monthlyRecommendations.general?.advice || monthlyRecommendations.advice}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="notifications" size={48} color="#2e7d32" />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Notificaciones urgentes */}
      {notifications.filter(n => n.priority === 'high').length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Acciones Urgentes</Text>
          {notifications
            .filter(n => n.priority === 'high')
            .map(renderNotification)}
        </View>
      )}

      {/* Recomendaciones mensuales */}
      {renderMonthlyRecommendations()}

      {/* Otras notificaciones */}
      {notifications.filter(n => n.priority !== 'high').length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Consejos y Cuidados</Text>
          {notifications
            .filter(n => n.priority !== 'high')
            .map(renderNotification)}
        </View>
      )}

      {/* Mensaje cuando no hay notificaciones */}
      {notifications.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="leaf" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No hay notificaciones</Text>
          <Text style={styles.emptyMessage}>
            Las notificaciones aparecerán cuando sea época de cuidados especiales para tus plantas.
          </Text>
          <TouchableOpacity
            style={styles.addPlantsButton}
            onPress={() => navigation.navigate('ScanIA')}
          >
            <Text style={styles.addPlantsButtonText}>Escanear nueva planta</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: '#F9FAFB',
    opacity: 0.8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  readText: {
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  monthlySection: {
    margin: 20,
    marginBottom: 0,
  },
  userSpecificSection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  speciesName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  generalSection: {
    marginTop: 16,
  },
  generalAdviceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  generalAdviceText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addPlantsButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addPlantsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});