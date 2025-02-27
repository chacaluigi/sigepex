/*
    Ruta: /api/reportes/ebr || /api/reportes/ceba || /api/reportes/residencia
*/

const { Router } = require('express');

const { 
    generarInformeDiario,
    getDataBetweenDates,
    getDataforGraph,
    getAllReporte,
} = require('../controllers/reportes');

const router = Router();

router.get('/reporte_hoy', generarInformeDiario);
router.get('/ebr', getAllReporte);
router.get('/reporte_fechas', getDataBetweenDates);
router.get('/reporte_graficos', getDataforGraph);

module.exports = router;