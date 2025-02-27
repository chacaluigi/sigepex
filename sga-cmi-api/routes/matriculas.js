/*
    Ruta: /api/matriculas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
    getMatriculas,
    getMatricula, 
    registrarMatricula, 
    actualizarMatricula, 
    eliminarMatricula,
    searchStudent,
    getMatriculasByGrado,
} = require('../controllers/matricula');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getMatriculas);

router.get('/:id', getMatricula);
router.get('/grado/:gradoId', getMatriculasByGrado);

router.get('/search/:search', searchStudent);

router.post('/', [
    validarJWT, 
    validarCampos,
] , registrarMatricula);

router.put('/:id',[
    validarJWT, 
    check('id', 'El id es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarMatricula);

router.delete('/:id' ,
    [
        validarJWT,

        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos,
    ], eliminarMatricula);

module.exports = router;