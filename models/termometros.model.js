const { Schema, model } = require('mongoose');

const TermometrosSchema = Schema({

    code: {
        type: String,
        require: true,
        unique: true
    },

    status: {
        type: Boolean,
        default: true
    },

    temperatura: {
        type: String
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

TermometrosSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.tid = _id;
    return object;

});

module.exports = model('Termometros', TermometrosSchema);