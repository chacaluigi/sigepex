/*
    Ruta: /api/Sedes
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getSede, 
    getSedes, 
    crearSede,
    actualizarSede, 
    eliminarSede,
} = require('../controllers/sedes');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getSedes);

router.get('/:id', getSede);

router.post('/', [ 
    [validarJWT],
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearSede);

router.put('/:id', [
    [validarJWT],
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarSede);

// router.put('/inactivar/:id', validarJWT, inactivarCategoria);

// router.put('/activar/:id', validarJWT, activarCategoria);

router.delete('/:id', [
    [validarJWT],
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos,
], eliminarSede);

module.exports = router;