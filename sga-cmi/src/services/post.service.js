// services/post.service.js
import axios from 'axios';
import { ToastChakra } from '../helpers/toast';

const API_URL = process.env.REACT_APP_API_URL;

const getPostsBySolicitud = async solicitudId => {
  try {
    // 1. Obtener el token del localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.token) {
      throw new Error('No hay token de autenticación');
    }

    // 2. Configurar headers con el token
    const config = {
      headers: {
        Authorization: user.token,
        'Content-Type': 'application/json',
      },
    };

    // 3. Hacer la petición con el token
    const response = await axios.get(
      `${API_URL}/posts/solicitud/${solicitudId}`,
      config
    );
    return response.data.posts;
  } catch (error) {
    console.error('Error en getPostsBySolicitud:', error);
    ToastChakra(
      'ERROR',
      error.response?.data?.msg || error.message || 'Error al obtener posts',
      'error',
      1500
    );
    throw error;
  }
};

export default {
  getPostsBySolicitud,
};
