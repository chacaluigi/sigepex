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

const actualizarSolicitud = async (id, solicitudData, token) => {
  try {
    // Función para convertir a ISO string solo si es una fecha válida
    const toSafeISOString = date => {
      if (!date) return undefined;
      const d = new Date(date);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    };

    const dataToSend = {
      ...solicitudData,
      rangoFechaHora: solicitudData.rangoFechaHora
        ? {
            inicio: toSafeISOString(solicitudData.rangoFechaHora.inicio),
            fin: toSafeISOString(solicitudData.rangoFechaHora.fin),
          }
        : undefined,
    };

    const response = await axios.put(
      `${baseURL}/solicitudes/${id}`,
      dataToSend,
      config(token)
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Error al actualizar la solicitud';
    throw new Error(errorMessage);
  }
};

// services/solicitud.service.js
const editarSolicitud = async (id, updateData, token) => {
  try {
    // Preparar datos para la petición (similar al controller)
    const dataToSend = {
      ...updateData,
      // Si estado es "Completado" y no viene fecha_finalizacion, el backend la agregará
    };

    const response = await axios.put(
      `${baseURL}/solicitudes/${id}`,
      dataToSend,
      config(token)
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      'Error al editar la solicitud';
    throw new Error(errorMessage);
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
  editarSolicitud,
  createSolicitud,
};

export default solicitudService;
