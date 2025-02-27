/*
    Ruta: /api/grados
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getGrado, 
    getGrados, 
    crearGrado,
    actualizarGrado, 
    eliminarGrado,
} = require('../controllers/grados');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getGrados);

router.get('/:id', getGrado);

router.post('/', [ 
    [validarJWT],
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearGrado);

router.put('/:id', [
    [validarJWT],
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarGrado);

// router.put('/inactivar/:id', validarJWT, inactivarCategoria);

// router.put('/activar/:id', validarJWT, activarCategoria);

router.delete('/:id', [
    [validarJWT],
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos,
], eliminarGrado);

module.exports = router;