import axios from "axios";
import { ToastChakra } from "../helpers/toast";

const API_URL = process.env.REACT_APP_API_URL;

const getAllMatriculas = async (token, desde, hasta) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        params : {
            desde,
            hasta
        }
    };
    const response = await axios.get(`${API_URL}/matriculas`, config);
    return response.data;
}

const getAllMatriculasByGrado = async (token, desde, hasta, gradoId) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        params : {
            desde,
            hasta,
        }
    };
    const response = await axios.get(`${API_URL}/matriculas/grado/${gradoId}`, config);
    return response.data;
}

const getMatricula = async (id) => {
    const response = await axios.get(`${API_URL}/matriculas/${id}`);
    return response.data;
}

const createMatricula = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.post(`${API_URL}/matriculas`, data, config);
    if (response.status === 201 || response.status === 200) {
        ToastChakra('ESTUDIANTE MATRICULADO CORRECTAMENTE', 'La matricula se ha registrado correctamente', 'success', 1500, 'bottom');
        return response.data.matricula;
    }
}

const updateMatricula = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.put(`${API_URL}/matriculas/${data._id}`, data, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra('MATRICULA MODIFICADA', 'La matricula ha sido modificada correctamente', 'success', 1500, 'top');
    }
    return response.data;
}

// const updateEstadoPago = async (data, token) => {
//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': token
//         }
//     }
//     const response = await axios.put(`${API_URL}/matriculas/estado/${data._id}`, data, config);
//     if (response.status === 200 || response.status === 201) {
//         ToastChakra('ESTADO ACTUALIZADO', 'Estado del pago ha sido actualizada', 'success', 1500, 'top');
//     }
//     return response.data.pago;
// }

const deleteMatricula = async (id, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
    const response = await axios.delete(`${API_URL}/matriculas/${id}`, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra('MATRICULA ELIMINADO', 'La matricula se ha eliminado correctamente', 'success', 1500, 'top');
        return response.data.matricula;
    }
}

const pagoService = {
    getAllMatriculas,
    getMatricula,
    getAllMatriculasByGrado,
    createMatricula,
    updateMatricula,
    deleteMatricula,
}

export default pagoService;