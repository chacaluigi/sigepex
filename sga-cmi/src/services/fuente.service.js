// services/fuente.service.js
import axios from 'axios';
import { ToastChakra } from '../helpers/toast';

const baseURL = process.env.REACT_APP_API_URL;

const config = (token = null) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
  },
  params: { nocache: new Date().getTime() }, // Evita caché
});

const obtenerFuentes = async token => {
  try {
    const response = await axios.get(`${baseURL}/fuentes`, config(token));
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Error al obtener las fuentes';
    ToastChakra('Error', errorMessage, 'error', 2500, 'top');
    throw new Error(errorMessage);
  }
};

const actualizarFuentesSolicitud = async (solicitudId, fuentes, token) => {
  try {
    const response = await axios.patch(
      `${baseURL}/solicitudes/${solicitudId}/fuentes`,
      { fuentes },
      config(token)
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Error al actualizar las fuentes de la solicitud';
    throw new Error(errorMessage);
  }
};

const fuenteService = {
  obtenerFuentes,
  actualizarFuentesSolicitud,
};

export default fuenteService;
