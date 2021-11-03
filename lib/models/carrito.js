'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carritoSchema = new Schema({
    products: {
        array: [
            {
                product: {
                    type: Schema.Types.ObjectId, //indica q este atributo sera un id
                    ref: 'Product', // a que tabla hace referencia
                    required: true // este campo es obligatorio
                },
                quantity: Number
                
        }]
    }
});
    //timestamps: true //timestamps te crea automaticamente la fecha de creacion y fecha de modificado

module.exports = mongoose.model('Cart', carritoSchema);