import axios from 'axios';
import { ToastChakra } from '../helpers/toast';

const baseURL = process.env.REACT_APP_API_URL;

const config = (token = null) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
  },
});

const getReports = async token => {
  try {
    const response = await axios.get(`${baseURL}/reports`, config(token));
    return response.data;
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    return null;
  }
};

const getReport = async (id, token) => {
  try {
    const response = await axios.get(`${baseURL}/reports/${id}`, config(token));
    return response.data;
  } catch (error) {
    console.error('Error obteniendo el reporte:', error);
    return null;
  }
};

const createReport = async (report, token) => {
  try {
    const response = await axios.post(
      `${baseURL}/reports`,
      report,
      config(token)
    );
    ToastChakra(
      'Reporte creado',
      'El reporte se ha generado correctamente',
      'success',
      2500,
      'top'
    );
    return response.data;
  } catch (error) {
    console.error('Error creando el reporte:', error);
    return null;
  }
};

const updateReport = async (report, token) => {
  try {
    const response = await axios.put(
      `${baseURL}/reports/${report._id}`,
      report,
      config(token)
    );
    ToastChakra(
      'Reporte actualizado',
      'El reporte ha sido actualizado correctamente',
      'success',
      2500,
      'top'
    );
    return response.data;
  } catch (error) {
    console.error('Error actualizando el reporte:', error);
    return null;
  }
};

const deleteReport = async (id, token) => {
  try {
    const response = await axios.delete(
      `${baseURL}/reports/${id}`,
      config(token)
    );
    if (response.status === 204) {
      ToastChakra(
        'Reporte eliminado',
        'El reporte ha sido eliminado correctamente',
        'info',
        2500,
        'top'
      );
    }
    return response.status;
  } catch (error) {
    console.error('Error eliminando el reporte:', error);
    return null;
  }
};

const reportService = {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
};

export default reportService;
