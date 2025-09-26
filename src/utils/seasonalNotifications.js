// src/utils/seasonalNotifications.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spanishSpeciesDatabase } from '../data/speciesDatabase';

// Generar notificaciones basadas en plantas guardadas del usuario
export const generateSeasonalNotifications = async () => {
  try {
    const storedTrees = await AsyncStorage.getItem('myTrees');
    if (!storedTrees) return [];

    const userTrees = JSON.parse(storedTrees);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const notifications = [];

    for (const tree of userTrees) {
      if (tree.analysis && tree.analysis.species) {
        const notification = createNotificationForTree(tree, currentMonth);
        if (notification) {
          notifications.push(notification);
        }
      }
    }

    return notifications;
  } catch (error) {
    console.error('Error generando notificaciones:', error);
    return [];
  }
};

// Crear notificación específica para un árbol
const createNotificationForTree = (tree, currentMonth) => {
  const analysis = tree.analysis;
  
  // Buscar especies en la base de datos para obtener información detallada
  const speciesMatch = findSpeciesInDatabase(analysis.species);
  
  if (!speciesMatch) return null;

  const species = speciesMatch.data;
  const seasonalAdvice = getCurrentSeasonalAdvice(species, currentMonth);
  const pruningNotification = checkPruningTime(species, currentMonth);
  
  if (pruningNotification || seasonalAdvice) {
    return {
      id: `${tree.id}_${currentMonth}`,
      treeId: tree.id,
      species: analysis.species,
      type: pruningNotification ? 'pruning' : 'care',
      priority: pruningNotification ? 'high' : 'medium',
      title: pruningNotification ? 
        `Época de poda para tu ${species.commonNames[0]}` :
        `Cuidados de temporada para tu ${species.commonNames[0]}`,
      message: pruningNotification || seasonalAdvice,
      createdAt: new Date().toISOString(),
      month: currentMonth,
      actionable: true,
      details: {
        pruningAdvice: species.pruningAdvice,
        seasonalCare: species.seasonalCare,
        currentSeason: getCurrentSeason(currentMonth)
      }
    };
  }

  return null;
};

// Buscar especies en la base de datos
const findSpeciesInDatabase = (speciesName) => {
  const entries = Object.entries(spanishSpeciesDatabase);
  
  // Buscar por nombre común o científico
  const match = entries.find(([key, species]) => {
    const commonNamesMatch = species.commonNames.some(name => 
      speciesName.toLowerCase().includes(name.toLowerCase())
    );
    const scientificNameMatch = speciesName.toLowerCase().includes(
      species.scientificName.toLowerCase()
    );
    return commonNamesMatch || scientificNameMatch;
  });

  return match ? { key: match[0], data: match[1] } : null;
};

// Verificar si es época de poda
const checkPruningTime = (species, currentMonth) => {
  const pruningseason = species.pruningAdvice.season;
  const isTime = isPruningseason(pruningseason, currentMonth);
  
  if (isTime) {
    return `¡Es época de poda! ${species.pruningAdvice.description}. Recuerda: ${species.pruningAdvice.specificActions[0]?.action || 'Consultar guía específica'}.`;
  }

  // Verificar si se acerca la época (mes anterior)
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const isComingSoon = isPruningseason(pruningseason, nextMonth);
  
  if (isComingSoon) {
    return `La época de poda se acerca el próximo mes. Prepara las herramientas y planifica la poda de ${species.pruningAdvice.type.toLowerCase()}.`;
  }

  return null;
};

// Obtener consejos estacionales actuales
const getCurrentSeasonalAdvice = (species, currentMonth) => {
  const currentSeason = getCurrentSeason(currentMonth);
  const seasonalCare = species.seasonalCare;
  
  if (seasonalCare && seasonalCare[currentSeason]) {
    return `Cuidados de ${getSeasonName(currentSeason)}: ${seasonalCare[currentSeason]}`;
  }

  return null;
};

// Determinar época de poda
const isPruningseason = (pruningseason, month) => {
  const seasonMap = {
    'Invierno': [12, 1, 2],
    'Primavera': [3, 4, 5],
    'Verano': [6, 7, 8],
    'Otoño': [9, 10, 11],
    'Final invierno': [1, 2, 3],
    'Invierno (Enero-Febrero)': [1, 2],
    'Final invierno (Febrero-Marzo)': [2, 3],
    'Primavera-Verano': [3, 4, 5, 6, 7, 8]
  };

  for (const [season, months] of Object.entries(seasonMap)) {
    if (pruningseason.includes(season)) {
      return months.includes(month);
    }
  }
  return false;
};

// Obtener estación actual
const getCurrentSeason = (month) => {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// Nombres de estaciones en español
const getSeasonName = (season) => {
  const names = {
    'spring': 'primavera',
    'summer': 'verano',
    'autumn': 'otoño',
    'winter': 'invierno'
  };
  return names[season] || season;
};

// Filtrar notificaciones por tipo
export const getNotificationsByType = async (type) => {
  const allNotifications = await generateSeasonalNotifications();
  return allNotifications.filter(notification => notification.type === type);
};

// Obtener notificaciones de alta prioridad (poda)
export const getHighPriorityNotifications = async () => {
  const allNotifications = await generateSeasonalNotifications();
  return allNotifications.filter(notification => notification.priority === 'high');
};

// Marcar notificación como vista
export const markNotificationAsRead = async (notificationId) => {
  try {
    const readNotifications = await AsyncStorage.getItem('readNotifications');
    const readList = readNotifications ? JSON.parse(readNotifications) : [];
    
    if (!readList.includes(notificationId)) {
      readList.push(notificationId);
      await AsyncStorage.setItem('readNotifications', JSON.stringify(readList));
    }
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
  }
};

// Verificar si una notificación ha sido leída
export const isNotificationRead = async (notificationId) => {
  try {
    const readNotifications = await AsyncStorage.getItem('readNotifications');
    const readList = readNotifications ? JSON.parse(readNotifications) : [];
    return readList.includes(notificationId);
  } catch (error) {
    console.error('Error verificando notificación leída:', error);
    return false;
  }
};

// Obtener resumen de notificaciones
export const getNotificationSummary = async () => {
  const allNotifications = await generateSeasonalNotifications();
  const highPriority = allNotifications.filter(n => n.priority === 'high');
  const medium = allNotifications.filter(n => n.priority === 'medium');
  
  return {
    total: allNotifications.length,
    highPriority: highPriority.length,
    medium: medium.length,
    hasUnread: allNotifications.length > 0
  };
};

// Generar recomendaciones mensuales personalizadas
export const getMonthlyRecommendations = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const storedTrees = await AsyncStorage.getItem('myTrees');
    
    if (!storedTrees) {
      return getGeneralMonthlyAdvice(currentMonth);
    }

    const userTrees = JSON.parse(storedTrees);
    const recommendations = [];

    // Generar recomendaciones basadas en las plantas del usuario
    for (const tree of userTrees) {
      if (tree.analysis) {
        const speciesMatch = findSpeciesInDatabase(tree.analysis.species);
        if (speciesMatch) {
          const species = speciesMatch.data;
          const currentSeason = getCurrentSeason(currentMonth);
          
          if (species.seasonalCare && species.seasonalCare[currentSeason]) {
            recommendations.push({
              species: species.commonNames[0],
              advice: species.seasonalCare[currentSeason],
              category: species.category,
              priority: isPruningseason(species.pruningAdvice.season, currentMonth) ? 'high' : 'medium'
            });
          }
        }
      }
    }

    return {
      month: getMonthName(currentMonth),
      userSpecific: recommendations,
      general: getGeneralMonthlyAdvice(currentMonth)
    };
    
  } catch (error) {
    console.error('Error generando recomendaciones mensuales:', error);
    return getGeneralMonthlyAdvice(new Date().getMonth() + 1);
  }
};

// Consejos generales por mes
const getGeneralMonthlyAdvice = (month) => {
  const monthlyAdvice = {
    1: "Enero: Época ideal para poda de frutales. Planifica las podas de invierno.",
    2: "Febrero: Último mes para poda de almendros y frutales de hueso. Prepara injertos.",
    3: "Marzo: Inicio de temporada de crecimiento. Abonado y tratamientos preventivos.",
    4: "Abril: Vigilar plagas primaverales. Poda de rosales y arbustos ornamentales.",
    5: "Mayo: Control de riego. Eliminar brotes de agua y chupones.",
    6: "Junio: Poda verde en frutales. Aumentar frecuencia de riego.",
    7: "Julio: Mantenimiento estival. Proteger del calor extremo.",
    8: "Agosto: Riego abundante. Preparar para recolección de frutos.",
    9: "Septiembre: Inicio preparación otoñal. Reducir riegos gradualmente.",
    10: "Octubre: Plantar nuevos árboles. Recoger frutos tardíos.",
    11: "Noviembre: Protección contra heladas. Limpieza de hojas caídas.",
    12: "Diciembre: Preparación para poda invernal. Revisión de herramientas."
  };

  return {
    month: getMonthName(month),
    advice: monthlyAdvice[month] || "Cuidados generales según clima local.",
    season: getCurrentSeason(month)
  };
};

// Nombres de meses
const getMonthName = (month) => {
  const months = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month] || 'Mes desconocido';
};