const { response } = require('express');

const Termometro = require('../models/termometros.model');

/** =====================================================================
 *  GET TERMOMETRO
=========================================================================*/
const getTermometros = async(req, res) => {

    try {

        const { desde, hasta, ...query } = req.body;

        const [termometros, total] = await Promise.all([
            Termometro.find(query)
            .limit(hasta)
            .skip(desde),
            Termometro.countDocuments()
        ]);

        res.json({
            ok: true,
            termometros,
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
 *  GET TERMOMETRO ID
=========================================================================*/
const getTermometroId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const termometroDB = await Termometro.findById(id);
        if (!termometroDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun termometro con este ID'
            });
        }

        res.json({
            ok: true,
            termometro: termometroDB
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
 *  CREATE TERMOMETRO
=========================================================================*/
const createTermometro = async(req, res = response) => {

    
    try {
        
        const termometro = new Termometro(req.body);

        termometro.code = termometro.code.trim();

        const validarTermometro = await Termometro.findOne({ code: termometro.code });
        if (validarTermometro) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un termometro con este codigo'
            });
        }        

        // SAVE CANDIDATE
        await termometro.save();

        res.json({
            ok: true,
            termometro
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
 *  UPDATE TERMOMETRO
=========================================================================*/
const updateTermometro = async(req, res = response) => {
    
    try {

        const tid = req.params.id;

        // SEARCH TERMOMETRO
        const termometroDB = await Termometro.findById(tid);
        if (!termometroDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun termometro con este ID'
            });
        }
        // SEARCH TERMOMETRO

        // VALIDATE TERMOMETRO
        const { ...campos } = req.body;
        campos.code = campos.code.trim();

        if (termometroDB.code !== campos.code) {
            const validarTermometro = await Termometro.findOne({ code: campos.code });
            if (validarTermometro) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un termometro con este codigo'
                });
            }
        }

        // UPDATE
        const termometroUpdate = await Termometro.findByIdAndUpdate(tid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            termometro: termometroUpdate
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
 *  DELETE TERMOMETRO
=========================================================================*/
const deleteTermometro = async(req, res = response) => {
    
    try {
        const tid = req.params.id;
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
                    msg: 'No tienes los privilegios para editar este termometro'
                });
            }
        }
        // SEARCH USER
        
        // SEARCH CANDIDATE
        const termometroDB = await Termometro.findById({ _id: tid });
        if (!termometroDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun termometro con este ID'
            });
        }
        // SEARCH CANDIDATE

        // CHANGE STATUS
        if (termometroDB.status === true) {
            termometroDB.status = false;
        } else {
            termometroDB.status = true;
        }
        // CHANGE STATUS

        const termometroUpdate = await Termometro.findByIdAndUpdate(tid, termometroDB, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            termometro: termometroUpdate
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
    getTermometros,
    createTermometro,
    updateTermometro,
    deleteTermometro,
    getTermometroId
};