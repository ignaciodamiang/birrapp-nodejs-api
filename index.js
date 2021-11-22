'use strict'
require('module-alias/register'); //para que pueda usarse "abreviaturas" a la hora de usar rutas
const routes = require('@lib/routes');
// por ejemplo const User = require('@models/user'); el @models hace referencia a /lib/models/user y 
// te trae el modelo user ver mas en package.json en la parte _moduleAliases
const express = require('express'); // basicamente es lo que se usa para crear una api
const morgan = require('morgan'); // con morgan podemos ver en la terminal que peticiones se hacen en la api
require('dotenv').config(); // para que se pueda usar variables de entorno esto se hace a traves del archivo .env 
// (existen .env.prod .env.dev .env.qa para deploy testing o crear entorno dev pero nosotros solamente usaremos el
// .env ya que habria q configurar y tampoco subiremos la pagina a algun dominio asi q paja)
const publicPaths = require('./config/public-paths'); //aca definiremos que rutas seran publicas ...o sea para q todo mundo pueda obtener los datos de las rutas
const extractJwt = require('@utils/extract-jwt'); //esto es para decodear o parsear el token que deberia llegar
const app = express();
const cors = require('cors'); //esto para q acepte peticiones de otros servidores en este caso nuestro angular localhost:4200
app.use(express.json()); //para que express entienda objetos json
app.use(express.urlencoded({extended:false})); // para que entienda lo que viene de formulario html
app.use(cors());
app.use(morgan('dev')); //configuracion para ver las peticiones que se le hacen a la api y el estado q devuelve
// instale el nodemon esto es una maravilla xD basicamente sin esto tendriamos q detener la api y volver a correr por cada "guardar" que hagamos 
// y nodemon te lo hace automaticamente ver package.json ("start": "nodemon index.js" esto en produccion no iria ya que no sera "correcto" pero a nosotros nos re sirve para hacernos la vida mas facil) 
global.fetch = require('node-fetch');
const mongoose = require('mongoose'); //mongoose es mongo basicamente ...a continuacion nos conectaremos a la base de datos 
mongoose.Promise = Promise; // proccess.env es como indicaremos que nos referimos a la variable de entorno
return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB,
{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    app.get(publicPaths.regex('get'), extractJwt);
    app.put(publicPaths.regex('put'), extractJwt);
    app.post(publicPaths.regex('post'), extractJwt);
    app.delete(publicPaths.regex('delete'), extractJwt);
    Object.keys(routes).forEach((key) => {
        app.use(routes[key]);
    });
    app.listen(process.env.SERVER_PORT, () => console.log(`Servidor corriendo en el puerto ${process.env.SERVER_PORT}`));
});


