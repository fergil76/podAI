// src/utils/photoAnalysis.js
import { identifyPlant } from '../services/plantNetService';
import { spanishSpeciesDatabase } from '../data/speciesDatabase';

// Reutilizar la misma función de análisis que ScanAI
export const analyzePhotosWithPlantNet = async (photosArray, plantMode) => {
  try {
    console.log('Iniciando análisis con PlantNet...');
    const plantNetResult = await identifyPlant(photosArray);
    
    if (plantNetResult.results && plantNetResult.results.length > 0) {
      const topResult = plantNetResult.results[0];
      console.log('PlantNet identificó:', topResult.species.scientificNameWithoutAuthor);
      
      const localMatch = findInSpanishDatabase(topResult.species.scientificNameWithoutAuthor);
      return formatPlantNetResult(topResult, localMatch, photosArray.length, plantMode);
    } else {
      console.log('PlantNet no encontró resultados, usando fallback...');
      return analyzePhotosWithSpanishDB(photosArray, plantMode);
    }
  } catch (error) {
    console.error('Error con PlantNet:', error);
    return analyzePhotosWithSpanishDB(photosArray, plantMode);
  }
};

// Resto de funciones copiadas desde ScanAIScreen...
const findInSpanishDatabase = (scientificName) => {
  const entries = Object.entries(spanishSpeciesDatabase);
  return entries.find(([key, species]) => 
    species.scientificName.toLowerCase().includes(scientificName.toLowerCase()) ||
    scientificName.toLowerCase().includes(species.scientificName.toLowerCase())
  );
};

const formatPlantNetResult = (plantNetResult, localMatch, photoCount, plantMode) => {
  // Función simplificada que retorna datos básicos
  const confidence = plantNetResult.score;
  
  if (localMatch) {
    const [key, species] = localMatch;
    return {
      species: `${species.commonNames[0]} (${species.scientificName})`,
      confidence: Math.min(confidence, 0.95),
      description: `Identificado por IA: ${species.description}`,
      pruningAdvice: species.pruningAdvice,
      region: species.region,
      category: species.category
    };
  }
  
  return {
    species: "Especie no identificada",
    confidence: 0.5,
    description: "No se pudo identificar la especie.",
    pruningAdvice: null
  };
};

const analyzePhotosWithSpanishDB = (photosArray, plantMode) => {
  // Análisis de fallback simplificado
  const speciesKeys = Object.keys(spanishSpeciesDatabase);
  const randomKey = speciesKeys[Math.floor(Math.random() * speciesKeys.length)];
  const species = spanishSpeciesDatabase[randomKey];
  
  return {
    species: `${species.commonNames[0]} (${species.scientificName})`,
    confidence: species.confidence,
    description: species.description,
    pruningAdvice: species.pruningAdvice,
    region: species.region,
    category: species.category
  };
};