const { response } = require('express');

const Temperatura = require('../models/temperaturas.model');
const Termometro = require('../models/termometros.model');

/** ======================================================================
 *  GET TEMPERATURA
=========================================================================*/
const getTemperatura = async(req, res) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [temperaturas, total] = await Promise.all([
            Temperatura.find(query)
            .populate('termometro')
            .limit(hasta)
            .skip(desde)
            .sort({ fecha: -1 }),
            Temperatura.countDocuments(query)
        ]);

        res.json({
            ok: true,
            temperaturas,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }


};
/** =====================================================================
 *  CREATE TEMPERATURA
=========================================================================*/
const createTemperatura = async(req, res = response) => {


    try {
        // SAVE TEMPERATURA
        const temperatura = new Temperatura(req.body);

        const termometro = await Termometro.findOne({code: req.body.code});
        if (!termometro) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun termometro con este codigo'
            });
        }

        temperatura.termometro = termometro._id;

        await temperatura.save();

        res.json({
            ok: true,
            msg: 'Se ha guardado exitosamente!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
};
/** =====================================================================
 *  CREATE TEMPERATURA
=========================================================================*/

/** =====================================================================
 *  UPDATE TEMPERATURA
=========================================================================*/
const updateTemperatura = async(req, res = response) => {

    const teid = req.params.id;

    try {

        // SEARCH TEMPERATURA
        const temperaturaDB = await Temperatura.findById(teid);
        if (!temperaturaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun registro de temperatura con este ID'
            });
        }
        // SEARCH TEMPERATURA

        // VALIDATE USER
        let {...campos } = req.body;

        // UPDATE
        const temperaturaUpdate = await Temperatura.findByIdAndUpdate(teid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            temperatura: temperaturaUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }

};
/** =====================================================================
 *  UPDATE TEMPERATURA
=========================================================================*/
/** =====================================================================
 *  DELETE TEMPERATURA
=========================================================================*/
const deleteTemperatura = async(req, res = response) => {


    try {
        const teid = req.params.id;

        // SEARCH PRODUCT
        const temperaturaDB = await Temperatura.findById({ _id: teid });
        if (!temperaturaDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun registro de temperatura con este ID'
            });
        }
        // SEARCH PRODUCT

        await Temperatura.findByIdAndDelete(teid);

        res.json({
            ok: true,
            msg: 'El registro de temperatura fue eliminado con exito'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


// EXPORTS
module.exports = {
    getTemperatura,
    createTemperatura,
    updateTemperatura,
    deleteTemperatura,
};