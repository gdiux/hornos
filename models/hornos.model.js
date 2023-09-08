const { Schema, model } = require('mongoose');

const HornosSchema = Schema({

    name: {
        type: String,
        require: true,
    },

    alta: {
        type: Schema.Types.ObjectId,
        ref: 'Termometros'
    },

    baja: {
        type: Schema.Types.ObjectId,
        ref: 'Termometros'
    },

    tempA: {
        type: Schema.Types.ObjectId,
        ref: 'Temperaturas'
    },

    tempB: {
        type: Schema.Types.ObjectId,
        ref: 'Temperaturas'
    },

    status: {
        type: Boolean,
        default: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

HornosSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.hid = _id;
    return object;

});

module.exports = model('Hornos', HornosSchema);