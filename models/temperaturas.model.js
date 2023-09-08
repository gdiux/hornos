const { Schema, model } = require('mongoose');

const temperaturaSchema = Schema({

    temperatura: {
        type: String,
        require: true,
    },

    termometro: {
        type: Schema.Types.ObjectId,
        ref: 'Termometros'
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

temperaturaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.teid = _id;
    return object;

});

module.exports = model('Temperaturas', temperaturaSchema);