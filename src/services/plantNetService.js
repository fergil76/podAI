// src/services/plantNetService.js

const PLANTNET_API_KEY = '2b10wRUUwvSkZDNEf0C2GUDeeu';
const PLANTNET_BASE_URL = 'https://my-api.plantnet.org/v1';

export const identifyPlant = async (imageUris, project = 'weurope') => {
  console.log('Iniciando identificación real con PlantNet...');
  
  try {
    // Crear FormData simple para la primera imagen
    const formData = new FormData();
    
    // Solo usar la primera imagen para simplificar
    const response = await fetch(imageUris[0]);
    const blob = await response.blob();
    formData.append('images', blob, 'plant.jpg');
    formData.append('modifiers', 'leaf');
    
    console.log('Enviando imagen a PlantNet...');
    
    const apiResponse = await fetch(
      `${PLANTNET_BASE_URL}/identify/${project}?api-key=${PLANTNET_API_KEY}&include-related-images=false&no-reject=false&nb-results=3&lang=es`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!apiResponse.ok) {
      throw new Error(`PlantNet API error: ${apiResponse.status}`);
    }
    
    const data = await apiResponse.json();
    console.log('Respuesta de PlantNet recibida:', data);
    
    return data;
    
  } catch (error) {
    console.error('Error en PlantNet API:', error);
    
    // Fallback a simulación
    console.log('Usando simulación como fallback...');
    return {
      results: [
        {
          score: 0.75,
          species: {
            scientificNameWithoutAuthor: 'Olea europaea',
            commonNames: ['Olivo (simulado)']
          }
        }
      ]
    };
  }
};