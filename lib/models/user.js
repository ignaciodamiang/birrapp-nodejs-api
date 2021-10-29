'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    password: {
        type: String
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
        unique: true //indica que este campo unico (no puede haber otro user con el mismo email)
    },
    carrito: {
        type: Schema.Types.ObjectId, //declara el tipo de dato en este caso un objeto
        ref: 'Carrito' // indica el modelo al cual hace referencia el objeto
        //required: true //indica que es requerido
    },
    direccion: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
