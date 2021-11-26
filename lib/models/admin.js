'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//solucion modo alambre ya que necesitamos un rol admin y no tenemos en aws como poner atributos q no sean obligatorios 
//mejor creamos un modelo admin q solo contenga correos ...ni el usuario ni con la api podremos agregar admins ...solo se podra agregar
//modificando la base de datos y subiendo "emails" en el modelo Admin 
//al tiempo de logear buscara admins en la base de datos y si lo encuentra devolvera el token
//con este dato userRol = 'admin' , sino encuentra ningun admin con ese mail simplmente sera userRol = 'user'
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);
