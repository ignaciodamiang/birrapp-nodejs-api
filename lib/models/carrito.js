'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carritoSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    },
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', carritoSchema);
