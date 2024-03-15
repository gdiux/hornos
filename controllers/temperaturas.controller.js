const { response } = require('express');

const ObjectId = require('mongoose').Types.ObjectId;

const moment = require('moment');

const Temperatura = require('../models/temperaturas.model');
const Termometro = require('../models/termometros.model');

/** ======================================================================
 *  GET TEMPERATURA
=========================================================================*/
const getTemperatura = async(req, res) => {

    try {

        const { desde, hasta, ...query } = req.body;

        if (query.termometro) {
            if (!ObjectId.isValid(query.termometro)) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Error en el ID de la termocupla'
                });
            }
        }

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

/** ======================================================================
 *  GET TEMPERATURA INTERVAL
=========================================================================*/
const getTemperaturasInterval = async(req, res = response) => {

    try {

        let { intervalo, termometro, fechaInicio, fechaFin } = req.body;

        fechaInicio = moment(fechaInicio);
        fechaFin = moment(fechaFin);

        const datas = [];
        const temperaturas = [];

        let fechaActual = moment(fechaInicio);

        while (fechaActual.isBefore(fechaFin)) {
            const fechaLapsoFin = fechaActual.clone().add(intervalo, 'minutes');

            const registrosEnLapso = await Temperatura.find({
                termometro,
                fecha: {
                    $gte: fechaActual.toDate(),
                    $lt: fechaLapsoFin.toDate(),
                },
            });

            datas.push(registrosEnLapso);

            fechaActual = fechaLapsoFin;
        }

        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];

            if (data[data.length - 1] !== undefined) {
                temperaturas.push(data[data.length - 1]);
            }

        }

        res.json({
            ok: true,
            temperaturas,
            total: temperaturas.length
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

        const termometro = await Termometro.findOne({ code: req.body.code });
        if (!termometro) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun termometro con este codigo'
            });
        }

        temperatura.termometro = termometro._id;

        await temperatura.save();

        let campos = {
            temperatura: temperatura.temperatura,
            fecha: temperatura.fecha
        }

        await Termometro.findByIdAndUpdate(termometro._id, campos, { new: true, useFindAndModify: false });

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
    getTemperaturasInterval
};