// src/services/plantNetService.js
const PLANTNET_API_KEY = '2b10wRUUwvSkZDNEf0C2GUDeeu';

export const identifyPlant = async (imageUris) => {
  console.log('Iniciando identificación real con PlantNet v2...');
  
  try {
    const formData = new FormData();
    
    // Agregar primera imagen
    const imageUri = imageUris[0];
    formData.append('images', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    });
    
    // Parámetros según documentación oficial
    formData.append('organs', 'leaf');
    
    console.log('Enviando imagen a PlantNet v2...');
    
    const response = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('¡PlantNet funcionando! Respuesta:', data);
    return data;
    
  } catch (error) {
    console.error('Error en PlantNet API:', error);
    throw error;
  }
};