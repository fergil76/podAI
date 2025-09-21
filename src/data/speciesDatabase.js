// src/data/speciesDatabase.js
// Base de datos de especies comunes en España con consejos de poda específicos

export const spanishSpeciesDatabase = {
  // ÁRBOLES FRUTALES
  "almendro": {
    scientificName: "Prunus dulcis",
    commonNames: ["Almendro", "Almendrera"],
    region: "Mediterránea (Andalucía, Valencia, Murcia, Baleares)",
    category: "frutal",
    confidence: 0.92,
    description: "Árbol frutal de la familia Rosaceae, muy común en el levante español",
    
    pruningAdvice: {
      season: "Invierno (Enero-Febrero)",
      type: "Poda de fructificación",
      timing: "Después de la cosecha, antes de la floración",
      description: "Poda para equilibrar producción y crecimiento vegetativo",
      
      specificActions: [
        {
          action: "Eliminar ramas secas, rotas o enfermas",
          priority: "Alta",
          reason: "Prevenir propagación de enfermedades"
        },
        {
          action: "Aclarar centro del árbol",
          priority: "Alta", 
          reason: "Mejorar ventilación y entrada de luz"
        },
        {
          action: "Recortar brotes verticales (chupones)",
          priority: "Media",
          reason: "Evitar competencia con ramas productivas"
        },
        {
          action: "Equilibrar ramas principales",
          priority: "Media",
          reason: "Distribuir uniformemente la producción"
        }
      ],
      
      benefits: [
        "Incrementa la producción de almendras",
        "Mejora el calibre del fruto",
        "Facilita la recolección mecanizada",
        "Reduce enfermedades fúngicas",
        "Prolonga la vida productiva del árbol"
      ],
      
      avoidActions: [
        "No podar en época de lluvias (riesgo de hongos)",
        "No cortar ramas principales gruesas sin protección",
        "Evitar poda severa que debilite el árbol"
      ]
    },
    
    seasonalCare: {
      spring: "Vigilar floración y cuajado",
      summer: "Riego controlado, vigilar plagas",
      autumn: "Preparar recolección",
      winter: "Poda principal y tratamientos preventivos"
    },
    
    commonPests: ["Pulgón", "Cochinilla", "Tigre del almendro"],
    diseases: ["Monilia", "Cribado", "Roya"]
  },

  "olivo": {
    scientificName: "Olea europaea",
    commonNames: ["Olivo", "Olivera", "Aceituno"],
    region: "Toda España (especialmente Andalucía, Castilla-La Mancha, Extremadura)",
    category: "frutal",
    confidence: 0.95,
    description: "Árbol milenario mediterráneo, símbolo de la cultura española",
    
    pruningAdvice: {
      season: "Final invierno (Febrero-Marzo)",
      type: "Poda de renovación y producción",
      timing: "Después de heladas, antes de brotación",
      description: "Poda suave para mantener equilibrio vegetativo-productivo",
      
      specificActions: [
        {
          action: "Eliminar chupones y ramas cruzadas",
          priority: "Alta",
          reason: "Mejorar estructura y ventilación"
        },
        {
          action: "Abrir el centro (poda en vaso)",
          priority: "Alta",
          reason: "Facilitar entrada de luz solar"
        },
        {
          action: "Recortar ramas que tocan el suelo",
          priority: "Media",
          reason: "Evitar contacto frutos con tierra"
        },
        {
          action: "Equilibrar altura del árbol",
          priority: "Baja",
          reason: "Facilitar recolección manual o mecánica"
        }
      ],
      
      benefits: [
        "Aumenta producción de aceitunas de calidad",
        "Facilita tratamientos fitosanitarios",
        "Mejora aireación y reduce humedad",
        "Renueva madera productiva",
        "Mantiene tamaño manejable"
      ],
      
      avoidActions: [
        "No podar más del 25% de la copa en un año",
        "Evitar cortes grandes sin cicatrizante",
        "No podar en años de gran cosecha sin compensar"
      ]
    },
    
    seasonalCare: {
      spring: "Tratamientos preventivos contra mosca",
      summer: "Riego deficitario controlado",
      autumn: "Recolección temprana para AOVE",
      winter: "Poda y laboreo del suelo"
    },
    
    commonPests: ["Mosca del olivo", "Prays", "Cochinilla"],
    diseases: ["Repilo", "Aceituna jabonosa", "Tuberculosis"]
  },

  "naranjo": {
    scientificName: "Citrus sinensis",
    commonNames: ["Naranjo dulce", "Naranjo", "Naranjero"],
    region: "Levante español (Valencia, Murcia, Andalucía)",
    category: "cítrico",
    confidence: 0.89,
    description: "Cítrico de gran importancia económica en el levante español",
    
    pruningAdvice: {
      season: "Final invierno (Febrero-Marzo)",
      type: "Poda de formación y limpieza",
      timing: "Después de heladas, antes de floración",
      description: "Poda ligera para mantener forma y sanidad",
      
      specificActions: [
        {
          action: "Eliminar ramas secas y enfermas",
          priority: "Alta",
          reason: "Prevenir propagación de patógenos"
        },
        {
          action: "Aclarar interior de la copa",
          priority: "Alta",
          reason: "Mejorar aireación y penetración luz"
        },
        {
          action: "Recortar chupones y rebrotes",
          priority: "Media",
          reason: "Dirigir energía a ramas productivas"
        },
        {
          action: "Equilibrar altura (máximo 3-4m)",
          priority: "Media",
          reason: "Facilitar recolección manual"
        }
      ],
      
      benefits: [
        "Mejora calidad y tamaño de naranjas",
        "Facilita tratamientos contra plagas",
        "Reduce alternancia productiva",
        "Mejora coloración de frutos",
        "Alarga vida productiva del árbol"
      ],
      
      avoidActions: [
        "No podar durante floración",
        "Evitar podas severas que estimulen chupones",
        "No cortar ramas con frutos cuajados"
      ]
    },
    
    seasonalCare: {
      spring: "Control de pulgones y minador",
      summer: "Riego abundante y regular",
      autumn: "Preparación para recolección",
      winter: "Poda y protección contra heladas"
    },
    
    commonPests: ["Minador", "Pulgón", "Cochinillas", "Mosca blanca"],
    diseases: ["Gomosis", "Mal secco", "Virus tristeza"]
  },

  "limonero": {
    scientificName: "Citrus limon",
    commonNames: ["Limonero", "Limón"],
    region: "Murcia, Alicante, Málaga",
    category: "cítrico",
    confidence: 0.87,
    description: "Cítrico muy productivo, requiere clima cálido",
    
    pruningAdvice: {
      season: "Final invierno-inicio primavera",
      type: "Poda de formación y fructificación",
      timing: "Marzo-Abril, evitando heladas",
      description: "Poda moderada para mantener productividad continua",
      
      specificActions: [
        {
          action: "Eliminar ramas entrecruzadas",
          priority: "Alta",
          reason: "Evitar roces y heridas"
        },
        {
          action: "Aclarar centro para ventilación",
          priority: "Alta",
          reason: "Reducir humedad y hongos"
        },
        {
          action: "Controlar altura (máximo 3m)",
          priority: "Media",
          reason: "Facilitar recolección continua"
        },
        {
          action: "Pinzar brotes muy vigorosos",
          priority: "Baja",
          reason: "Equilibrar crecimiento vegetativo"
        }
      ],
      
      benefits: [
        "Mantiene producción continua todo el año",
        "Mejora acceso para recolección",
        "Reduce problemas sanitarios",
        "Optimiza calidad del fruto"
      ],
      
      avoidActions: [
        "No podar durante floración principal",
        "Evitar podas severas en verano",
        "No cortar todas las ramas jóvenes"
      ]
    },
    
    seasonalCare: {
      spring: "Control minador, floración principal",
      summer: "Riego constante, segunda floración",
      autumn: "Recolección escalonada",
      winter: "Protección heladas, poda"
    },
    
    commonPests: ["Minador", "Araña roja", "Trips"],
    diseases: ["Mal secco", "Aguado", "Gomosis"]
  },

  // ÁRBOLES ORNAMENTALES
  "encina": {
    scientificName: "Quercus ilex",
    commonNames: ["Encina", "Carrasca", "Chaparro"],
    region: "Toda la Península Ibérica",
    category: "ornamental",
    confidence: 0.91,
    description: "Árbol emblemático español, muy resistente a sequía",
    
    pruningAdvice: {
      season: "Final invierno (Febrero-Marzo)",
      type: "Poda de mantenimiento y formación",
      timing: "Periodo de reposo vegetativo",
      description: "Poda muy ligera, respetando su forma natural",
      
      specificActions: [
        {
          action: "Eliminar solo ramas muertas o rotas",
          priority: "Alta",
          reason: "Mantener salud del árbol"
        },
        {
          action: "Aclarar suavemente ramas interiores",
          priority: "Baja",
          reason: "Mejorar estructura si es necesario"
        },
        {
          action: "Recortar ramas que interfieren paso",
          priority: "Media",
          reason: "Seguridad peatonal en parques"
        }
      ],
      
      benefits: [
        "Mantiene la forma natural característica",
        "Conserva resistencia a sequía",
        "Preserva hábitat para fauna",
        "Minimiza estrés del árbol"
      ],
      
      avoidActions: [
        "NUNCA hacer podas severas o desmochado",
        "No podar sin causa justificada",
        "Evitar cortes grandes innecesarios"
      ]
    },
    
    seasonalCare: {
      spring: "Vigilar brotación y posibles plagas",
      summer: "Resistente, mínimo mantenimiento",
      autumn: "Recolección de bellotas si interesa",
      winter: "Periodo óptimo para poda mínima"
    },
    
    commonPests: ["Procesionaria", "Lagarta"],
    diseases: ["Seca", "Chancro"]
  },

  "platano": {
    scientificName: "Platanus × acerifolia",
    commonNames: ["Plátano de paseo", "Plátano de sombra"],
    region: "Ciudades de toda España",
    category: "ornamental",
    confidence: 0.88,
    description: "Árbol urbano muy común en calles y parques españoles",
    
    pruningAdvice: {
      season: "Invierno (Diciembre-Febrero)",
      type: "Poda de formación urbana",
      timing: "Periodo sin hojas",
      description: "Poda necesaria para adaptación al entorno urbano",
      
      specificActions: [
        {
          action: "Formar copa elevada (mín. 3m altura)",
          priority: "Alta",
          reason: "Permitir paso peatonal y vehículos"
        },
        {
          action: "Eliminar ramas que rozan edificios",
          priority: "Alta",
          reason: "Evitar daños a infraestructuras"
        },
        {
          action: "Aclarar copa densa",
          priority: "Media",
          reason: "Reducir resistencia al viento"
        },
        {
          action: "Control de altura según espacio",
          priority: "Media",
          reason: "Adaptar a líneas eléctricas"
        }
      ],
      
      benefits: [
        "Adapta el árbol al entorno urbano",
        "Reduce riesgo de caída de ramas",
        "Mantiene sombra sin interferencias",
        "Prolonga vida útil en ciudad"
      ],
      
      avoidActions: [
        "Evitar desmochado completo",
        "No podar en primavera (sangrado excesivo)",
        "No eliminar más del 30% de copa"
      ]
    },
    
    seasonalCare: {
      spring: "Vigilar brotación tras poda",
      summer: "Riego en sequías prolongadas",
      autumn: "Retirada de hojas caídas",
      winter: "Periodo de poda principal"
    },
    
    commonPests: ["Pulgón lanígero", "Tigre del plátano"],
    diseases: ["Antracnosis", "Chancro coloreado"]
  },

  // PLANTAS PEQUEÑAS Y BONSÁIS
  "bonsai_ficus": {
    scientificName: "Ficus benjamina",
    commonNames: ["Bonsái Ficus", "Ficus Benjamin"],
    region: "Interior España (planta de interior)",
    category: "bonsai",
    confidence: 0.93,
    description: "Especie muy popular para bonsái, resistente y de crecimiento rápido",
    
    pruningAdvice: {
      season: "Primavera-Verano (Abril-Septiembre)",
      type: "Poda estética y de mantenimiento",
      timing: "Durante periodo de crecimiento activo",
      description: "Poda frecuente para mantener forma y estimular ramificación",
      
      specificActions: [
        {
          action: "Pinzado constante de brotes nuevos",
          priority: "Alta",
          reason: "Mantener silueta y estimular ramificación"
        },
        {
          action: "Eliminar hojas grandes",
          priority: "Media",
          reason: "Proporcionalidad con tamaño del bonsái"
        },
        {
          action: "Poda de ramas que rompen diseño",
          priority: "Alta",
          reason: "Mantener estilo elegido"
        },
        {
          action: "Defoliado parcial en verano",
          priority: "Baja",
          reason: "Reducir tamaño de hojas nuevas"
        }
      ],
      
      benefits: [
        "Mantiene proporción miniaturizada",
        "Estimula crecimiento de hojas pequeñas",
        "Desarrolla ramificación fina",
        "Fortalece el diseño del bonsái"
      ],
      
      avoidActions: [
        "No podar en invierno (crecimiento lento)",
        "Evitar poda severa de una sola vez",
        "No eliminar todas las hojas grandes juntas"
      ]
    },
    
    seasonalCare: {
      spring: "Trasplante cada 2-3 años, inicio poda",
      summer: "Poda intensiva, riego frecuente",
      autumn: "Reducir frecuencia de poda",
      winter: "Reposo, ubicación protegida"
    },
    
    commonPests: ["Cochinilla", "Araña roja", "Trips"],
    diseases: ["Hongos por exceso humedad"]
  },

  "bonsai_olmo": {
    scientificName: "Ulmus parvifolia",
    commonNames: ["Olmo chino", "Bonsái Olmo"],
    region: "Adaptado a toda España",
    category: "bonsai", 
    confidence: 0.90,
    description: "Excelente especie para bonsái, muy resistente",
    
    pruningAdvice: {
      season: "Final invierno-Primavera",
      type: "Poda estructural y de refinamiento",
      timing: "Antes de brotación primaveral",
      description: "Poda para desarrollar estructura y ramificación fina",
      
      specificActions: [
        {
          action: "Poda estructural en reposo",
          priority: "Alta",
          reason: "Definir estructura principal"
        },
        {
          action: "Pinzado durante crecimiento",
          priority: "Alta",
          reason: "Mantener forma y estimular brotes"
        },
        {
          action: "Eliminar ramas hacia abajo",
          priority: "Media",
          reason: "Mantener estética ascendente"
        },
        {
          action: "Aclarar zonas densas",
          priority: "Media",
          reason: "Permitir luz a ramas interiores"
        }
      ],
      
      benefits: [
        "Desarrolla estructura ramificada",
        "Mantiene hojas proporcionales",
        "Fortalece tronco y ramas",
        "Mejora definición del estilo"
      ],
      
      avoidActions: [
        "No podar raíces y ramas simultáneamente",
        "Evitar poda severa en ejemplares débiles",
        "No eliminar toda la vegetación de una zona"
      ]
    },
    
    seasonalCare: {
      spring: "Trasplante, poda estructural",
      summer: "Pinzado regular, protección sol intenso",
      autumn: "Reducir riegos y abonado",
      winter: "Protección heladas, poda de mantenimiento"
    },
    
    commonPests: ["Pulgón", "Araña roja"],
    diseases: ["Hongos por encharcamiento"]
  }
};

// Función para buscar especies por palabras clave
export const findSpeciesByKeywords = (keywords) => {
  const results = [];
  const searchTerms = keywords.toLowerCase().split(' ');
  
  for (const [key, species] of Object.entries(spanishSpeciesDatabase)) {
    const searchText = `${species.scientificName} ${species.commonNames.join(' ')} ${species.description}`.toLowerCase();
    
    const matches = searchTerms.filter(term => searchText.includes(term));
    if (matches.length > 0) {
      results.push({
        key,
        species,
        relevance: matches.length / searchTerms.length
      });
    }
  }
  
  return results.sort((a, b) => b.relevance - a.relevance);
};

// Función para obtener especies por región
export const getSpeciesByRegion = (region) => {
  return Object.entries(spanishSpeciesDatabase)
    .filter(([key, species]) => 
      species.region.toLowerCase().includes(region.toLowerCase())
    )
    .map(([key, species]) => ({ key, species }));
};

// Función para obtener especies por categoría
export const getSpeciesByCategory = (category) => {
  return Object.entries(spanishSpeciesDatabase)
    .filter(([key, species]) => species.category === category)
    .map(([key, species]) => ({ key, species }));
};

// Función para obtener consejos por época del año
export const getPruningAdviceByMonth = (month) => {
  const seasonMap = {
    12: 'winter', 1: 'winter', 2: 'winter',
    3: 'spring', 4: 'spring', 5: 'spring', 
    6: 'summer', 7: 'summer', 8: 'summer',
    9: 'autumn', 10: 'autumn', 11: 'autumn'
  };
  
  const season = seasonMap[month];
  const recommendations = [];
  
  Object.entries(spanishSpeciesDatabase).forEach(([key, species]) => {
    if (species.seasonalCare && species.seasonalCare[season]) {
      recommendations.push({
        species: species.commonNames[0],
        advice: species.seasonalCare[season],
        key
      });
    }
  });
  
  return recommendations;
};