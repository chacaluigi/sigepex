import axios from "axios";
import { ToastChakra } from "../helpers/toast";

const API_URL = process.env.REACT_APP_API_URL;

const name = 'SEDE';

const getAll= async (token) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    };
    const response = await axios.get(`${API_URL}/sedes`, config);
    return response.data;
}

const get = async (id) => {
    const response = await axios.get(`${API_URL}/sedes/${id}`);
    return response.data;
}

const create = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.post(`${API_URL}/sedes`, data, config);
    if (response.status === 201 || response.status === 200) {
        ToastChakra(`${name} REGISTRADO`, `El ${name} se ha creado correctamente`, 'success', 1500, 'bottom');
        return response.data;
    }
}

// Update grado

const update = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.put(`${API_URL}/sedes/${data._id}`, data, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra(`${name} MODIFICADO`, `El ${name} ha sido modificada correctamente`, 'success', 1500, 'bottom');
    }
    return response.data;
}

// Delete grado

const deleteSede = async (id, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
    const response = await axios.delete(`${API_URL}/sedes/${id}`, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra(`${name} ELIMINADO`, `El ${name} ha sido eliminada correctamente`, 'success', 1500, 'bottom');
        return response.data;
    }
}

const sedeService = {
    getAll,
    get,
    create,
    update,
    deleteSede
}

export default sedeService;