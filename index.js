'use strict'
require('module-alias/register'); //para que pueda usarse "abreviaturas" a la hora de usar rutas
// por ejemplo const User = require('@models/user'); el @models hace referencia a /lib/models/user y 
// te trae el modelo user ver mas en package.json en la parte _moduleAliases
const express = require('express'); // basicamente es lo que se usa para crear una api
const morgan = require('morgan'); // con morgan podemos ver en la terminal que peticiones se hacen en la api
require('dotenv').config(); // para que se pueda usar variables de entorno esto se hace a traves del archivo .env 
// (existen .env.prod .env.dev .env.qa para deploy testing o crear entorno dev pero nosotros solamente usaremos el
// .env ya que habria q configurar y tampoco subiremos la pagina a algun dominio asi q paja)
const app = express();
const cors = require('cors'); //esto para q acepte peticiones de otros servidores en este caso nuestro angular localhost:4200
app.use(express.json()); //para que express entienda objetos json
app.use(express.urlencoded({extended:false})); // para que entienda lo que viene de formulario html
app.use(cors());
app.use(morgan('dev')); //configuracion para ver las peticiones que se le hacen a la api y el estado q devuelve
const {generatorUser} = require('@utils/generator'); // estoy usando un metodo para generar automaticamente usuarios 
//es util para iniciar el proyecto y q todos tengamos al menos un mismo dato 
const User = require('@models/user');


// instale el nodemon esto es una maravilla xD basicamente sin esto tendriamos q detener la api y volver a correr por cada "guardar" que hagamos 
// y nodemon te lo hace automaticamente ver package.json ("start": "nodemon index.js") 


const mongoose = require('mongoose'); //mongoose es mongo basicamente ...a continuacion nos conectaremos a la base de datos 
    mongoose.Promise = Promise; // proccess.env es como indicaremos que nos referimos a la variable de entorno
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB,
        {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            // app.get app.post app.put ....etc con esto definiremos rutas y con que metodos le pegaran a la ruta ...
            //ahora mismo esta todo aca (index.js) el conectarse a mongo y las rutas pero tendriamos q separarlo 

            // ejemplo http://localhost:3000/jose
            app.get('/nombre/:nombre', (req, res) => {
                //hara un console log del param nombre en este caso "jose"
                console.log(req.params.nombre);
                //otro console log de lo que le llegue en el body
                console.log(req.body);

                //aca se pode interesante 
                // retorna todos los users ... User.find devuelve todos los registros de la tabla user
                // algo asi como (select * from user;) 
                // datito: si fuese User.find({nombre: 'jose'}) seria lo mismo que (select * from user where nombre = 'jose')
                return User.find()
                .then((usuariosEncontrados) => {
                    /* toda peticion a la api debe retornar algo esto se hace con 
                        res.status(numero).json({jsonAMandar}) donde numero es el numero de estado que queremos retornar
                        y el jsonAMandar es los datos en forma de json q mandaremos
                    */
                    return res.status(200).json({
                        hola: 'hola mundo',
                        mensajeMostrar: usuariosEncontrados
                    });
                }).catch((err) => {
                    console.log(err.message);
                    return res.status(500).json({
                        mensaje: 'error interno'                        
                    });
                });
            });
            app.post('/login', (req, res) => {
                console.log('req.body');
                console.log(req.body);
                const email = req.body.email.trim();
                const password = req.body.password.trim();

                return User.findOne({email, password})
                .then((userFound) => {
                    if(!userFound) {
                        return res.status(400).json({
                            mensajeMostrar: 'Error usuario no encontrado'
                        });
                    }
                    return res.status(200).json(userFound);
                })
                .catch((err) => {
                    console.error(err.message);
                    return res.status(500).json({
                        mensajeMostrar: 'Error busqueda de usuario'
                    });
                });
            });

            app.post('/register', (req, res) => {
                const name = req.body.name.trim();
                const lastName = req.body.lastName.trim();
                const email = req.body.email.trim();
                const password = req.body.password.trim();
                const direccion = req.body.direccion.trim();

                const newUser = new User({
                    nombre: name,
                    apellido: lastName,
                    password: password,
                    email: email,
                    direccion: direccion
                });

                return newUser.save()
                .then(() => {
                    return res.status(200).json({
                        mensajeMostrar: 'Nuevo usuario registrado'
                    });
                })
                .catch((err) => {
                    console.error(err.message);
                    return res.status(500).json({
                        mensajeMostrar: 'Error creacion de nuevo usuario'
                    });
                });
            });
            


            app.listen(process.env.SERVER_PORT, () => console.log(`Servidor corriendo en el puerto ${process.env.SERVER_PORT}`));
            return generatorUser();
        });


