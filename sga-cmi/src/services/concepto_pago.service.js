import axios from "axios";
import { ToastChakra } from "../helpers/toast";

const API_URL = process.env.REACT_APP_API_URL;

const getAllConceptosPago = async () => {
    const response = await axios.get(`${API_URL}/concepto_pago`);
    return response.data;
}

const getConceptoPago = async (id) => {
    const response = await axios.get(`${API_URL}/concepto_pago/${id}`);
    return response.data;
}

const createConceptoPago = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.post(`${API_URL}/concepto_pago`, data, config);
    if (response.status === 201 || response.status === 200) {
        ToastChakra('CONCEPTO REGISTRADO', 'El concepto se ha creado correctamente', 'success', 1500, 'bottom');
        return response.data;
    }
}

const updateConceptoPago = async (data, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    const response = await axios.put(`${API_URL}/concepto_pago/${data._id}`, data, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra('CONCEPTO MODIFICADO', 'El concepto ha sido modificada correctamente', 'success', 1500, 'bottom');
    }
    return response.data;
}

const deleteConceptoPago = async (id, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    };
    const response = await axios.delete(`${API_URL}/concepto_pago/${id}`, config);
    if (response.status === 200 || response.status === 201) {
        ToastChakra('CONCEPTO ELIMINADO', 'El concepto se ha eliminado correctamente', 'success', 1500, 'bottom');
        return response.data;
    }
}

const conceptoPagoService = {
    getAllConceptosPago,
    getConceptoPago,
    createConceptoPago,
    updateConceptoPago,
    deleteConceptoPago,
}

export default conceptoPagoService;