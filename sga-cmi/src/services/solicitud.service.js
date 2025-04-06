// services/solicitud.service.js
import axios from 'axios';
import { ToastChakra } from '../helpers/toast';

const baseURL = process.env.REACT_APP_API_URL;

const config = (token = null) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
  },
});

const getSolicitudes = async (page = 1, perPage = 10) => {
  const response = await axios.get(`${baseURL}/solicitudes`, {
    params: { page, perPage },
  });
  return response.data;
};

const actualizarSolicitud = async (id, solicitudData) => {
  try {
    const response = await axios.put(
      `${baseURL}/solicitudes/${id}`,
      solicitudData
    );
    return response.data;
  } catch (error) {
    // Mejor manejo de errores
    console.error('Error en actualizarSolicitud:', error);
    throw error; // Esto permitirá que el slice capture el error
  }
};
const createSolicitud = async (solicitud, token) => {
  console.log('Enviando solicitud:', solicitud); // Depuración
  try {
    const response = await axios.post(
      `${baseURL}/solicitudes`,
      solicitud,
      config(token)
    );
    ToastChakra(
      'Solicitud creada',
      'La solicitud se ha generado correctamente',
      'success',
      2500,
      'top'
    );
    return response.data;
  } catch (error) {
    console.error('Error creando la solicitud:', error);
    return null;
  }
};

const solicitudService = {
  getSolicitudes,
  actualizarSolicitud,
  createSolicitud,
};

export default solicitudService;
