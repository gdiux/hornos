/** =====================================================================
 *  HORNOS ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getHornos, getHornoId, createHorno, updateHorno, deleteHorno, getHornosDashboard } = require('../controllers/hornos.controller');

const router = Router();

/** =====================================================================
 *  POST HORNO
=========================================================================*/
router.post('/query', validarJWT, getHornos);

/** =====================================================================
 *  GET HORNO ID
=========================================================================*/
router.get('/:id', validarJWT, getHornoId);

/** =====================================================================
 *  GET HORNO ID
=========================================================================*/
router.get('/dashboard/temp', validarJWT, getHornosDashboard);

/** =====================================================================
 *  POST HORNO
=========================================================================*/
router.post('/', [
        validarJWT,
        check('name', 'El nombre es olbigatorio').not().isEmpty(),
        check('baja', 'El termometro de baja es olbigatorio').isMongoId(),
        check('alta', 'El termometro de alta es olbigatorio').isMongoId(),
        validarCampos
    ],
    createHorno
);

/** =====================================================================
 *  PUT HORNO
=========================================================================*/
router.put('/:id', validarJWT, updateHorno);

/** =====================================================================
 *  DELETE HORNO
=========================================================================*/
router.delete('/:id', validarJWT, deleteHorno);

// EXPORT
module.exports = router;