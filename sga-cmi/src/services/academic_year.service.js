import axios from "axios";
import { ToastChakra } from "../helpers/toast";

const API_URL = process.env.REACT_APP_API_URL;

const getAllAcademicYear = async ( token ) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    };
    const response = await axios.get(`${API_URL}/academic_year`, config);
    return response.data;
}

const getAcademicYear = async (id) => {
    const response = await axios.get(`${API_URL}/academic_year/${id}`);
    return response.data;
}

const createAcademicYear = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.post(`${API_URL}/academic_year`, data, config);
    if (response.status === 201 || response.status === 200) {
        ToastChakra('AÑO ACADEMICO CREADO', 'El año academico se ha creado correctamente', 'success', 1500, 'bottom');
        return response.data;
    }
}

const updateAcademicYear = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.put(`${API_URL}/academic_year/${data._id}`, data, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra('AÑO ACADEMICO MODIFICADO', 'El año academico ha sido modificada correctamente', 'success', 1500, 'bottom');
    }
    return response.data;
}

const deleteAcademicYear = async (id, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
    const response = await axios.delete(`${API_URL}/academic_year/${id}`, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra('AÑO ACADEMICO ELIMINADO', 'El año academico se ha eliminado correctamente', 'success', 1500, 'bottom');
        return response.data;
    }
}

const activoService = {
    getAllAcademicYear,
    getAcademicYear,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
}

export default activoService;