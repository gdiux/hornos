const { response } = require('express');

const Horno = require('../models/hornos.model');
const Temperatura = require('../models/temperaturas.model');

/** =====================================================================
 *  GET HORNOS
=========================================================================*/
const getHornos = async(req, res) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [hornos, total] = await Promise.all([
            Horno.find(query)
            .limit(hasta)
            .skip(desde),
            Horno.countDocuments()
        ]);

        res.json({
            ok: true,
            hornos,
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
 *  GET HORNOS
=========================================================================*/
const getHornosDashboard = async(req, res) => {

    try {
        
        const [hornos, total] = await Promise.all([
            Horno.find({status: true}),
            Horno.countDocuments()
        ]);

        for (let i = 0; i < hornos.length; i++) {
            const horno = hornos[i];

            
            let tempB = await Temperatura.findOne({termometro: horno.baja})
            .populate('termometro')
            .sort({ fecha: -1 });
            let tempA = await Temperatura.findOne({termometro: horno.alta})    
            .populate('termometro')
            .sort({ fecha: -1 });
            
            hornos[i].tempB = tempB;
            hornos[i].tempA = tempA;

        }


        res.json({
            ok: true,
            hornos,
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
 *  GET HORNO ID
=========================================================================*/
const getHornoId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const hornoDB = await Horno.findById(id)
            .populate('alta')
            .populate('baja');
        if (!hornoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun horno con este ID'
            });
        }

        res.json({
            ok: true,
            horno: hornoDB
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
 *  CREATE HORNO
=========================================================================*/
const createHorno = async(req, res = response) => {

    
    try {
        
        const horno = new Horno(req.body);
        horno.name = horno.name.trim();       

        // SAVE CANDIDATE
        await horno.save();

        res.json({
            ok: true,
            horno
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
 *  UPDATE HORNO
=========================================================================*/
const updateHorno = async(req, res = response) => {
    
    try {

        const hid = req.params.id;

        // SEARCH HORNO
        const hornoDB = await Horno.findById(hid);
        if (!hornoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun horno con este ID'
            });
        }
        // SEARCH HORNO

        // VALIDATE HORNO
        const { ...campos } = req.body;

        // UPDATE
        const hornoUpdate = await Horno.findByIdAndUpdate(hid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            horno: hornoUpdate
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
 *  DELETE HORNO
=========================================================================*/
const deleteHorno = async(req, res = response) => {
    
    try {
        const hid = req.params.id;
        const uid = req.uid;

        // SEARCH USER
        const userDB = await User.findById({ _id: uid });
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }else{
            if (userDB.role !== 'ADMIN') {
                return res.status(400).json({
                    ok: false,
                    msg: 'No tienes los privilegios para editar este horno'
                });
            }
        }
        // SEARCH USER
        
        // SEARCH CANDIDATE
        const hornoDB = await Horno.findById({ _id: hid });
        if (!hornoDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun horno con este ID'
            });
        }
        // SEARCH CANDIDATE

        // CHANGE STATUS
        if (hornoDB.status === true) {
            hornoDB.status = false;
        } else {
            hornoDB.status = true;
        }
        // CHANGE STATUS

        const hornoUpdate = await Horno.findByIdAndUpdate(hid, hornoDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            horno: hornoUpdate
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
    getHornos,
    createHorno,
    updateHorno,
    deleteHorno,
    getHornoId,
    getHornosDashboard
};