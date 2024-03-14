/** =====================================================================
 *  TEMPERATURAS ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getTemperatura, createTemperatura, updateTemperatura, deleteTemperatura, getTemperaturasInterval } = require('../controllers/temperaturas.controller');

const router = Router();

/** =====================================================================
 *  GET QUERY
=========================================================================*/
router.post('/query', getTemperatura);

/** =====================================================================
 *  GET QUERY INTERVAL
=========================================================================*/
router.post('/intervalo', validarJWT, getTemperaturasInterval);

/** =====================================================================
 *  POST CREATE LOG TEMPERATURA
=========================================================================*/
router.post('/', [
        check('code', 'El codigo es obligatorio').not().isEmpty(),
        check('temperatura', 'La temperatura es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createTemperatura
);

/** =====================================================================
 *  PUT TEMPERATURA
=========================================================================*/
router.put('/:id', validarJWT, updateTemperatura);

/** =====================================================================
 *  DELETE USER
=========================================================================*/
router.delete('/:id', validarJWT, deleteTemperatura);



// EXPORT
module.exports = router;