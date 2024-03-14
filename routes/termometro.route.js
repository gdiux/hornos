/** =====================================================================
 *  TERMOMETRO ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getTermometros, getTermometroId, createTermometro, updateTermometro, deleteTermometro, getTermometroCode } = require('../controllers/termometros.controller');


const router = Router();

/** =====================================================================
 *  POST TERMOMETRO
=========================================================================*/
router.post('/query', validarJWT, getTermometros);

/** =====================================================================
 *  GET TERMOMETRO ID
=========================================================================*/
router.get('/:id', validarJWT, getTermometroId);

/** =====================================================================
 *  GET TERMOMETRO ID
=========================================================================*/
router.get('/codigo/:code', getTermometroCode);

/** =====================================================================
 *  POST TERMOMETRO
=========================================================================*/
router.post('/', [
        validarJWT,
        check('code', 'El nombre es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    createTermometro
);

/** =====================================================================
 *  PUT TERMOMETRO
=========================================================================*/
router.put('/:id', validarJWT, updateTermometro);

/** =====================================================================
 *  DELETE TERMOMETRO
=========================================================================*/
router.delete('/:id', validarJWT, deleteTermometro);

// EXPORT
module.exports = router;