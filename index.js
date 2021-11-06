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
const Cart = require('@models/carrito');



// instale el nodemon esto es una maravilla xD basicamente sin esto tendriamos q detener la api y volver a correr por cada "guardar" que hagamos 
// y nodemon te lo hace automaticamente ver package.json ("start": "nodemon index.js") 

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const Product = require('@models/producto'); //traigo el modelo user

const poolData = {    
    UserPoolId : "us-east-2_PdnQkA2Bb", // Your user pool id here    
    ClientId : "7n6ktka00arkrikn2et9uget3k" // Your client id here
    }; 
const pool_region = 'us-east-2';

    
const mongoose = require('mongoose'); //mongoose es mongo basicamente ...a continuacion nos conectaremos a la base de datos 
    mongoose.Promise = Promise; // proccess.env es como indicaremos que nos referimos a la variable de entorno
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB,
        {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            // app.get app.post app.put ....etc con esto definiremos rutas y con que metodos le pegaran a la ruta ...
            //ahora mismo esta todo aca (index.js) el conectarse a mongo y las rutas pero tendriamos q separarlo 

            app.post('/nuevoproducto', (req, res) => {
                return Product.create({
                    description: req.body.descripcion,
                    name: req.body.nombre,
                    price : req.body.precio,
                    type: req.body.tipo
                }).then(() => {
                    return res.status(200).json({
                        mensaje: 'todo bien'                        
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                    return res.status(500).json({
                        mensaje: 'error interno'                        
                    });
                });
            });
            app.post('/carrito', (req, res) => {
                const arrayAGuardar = [
                    {
                        quantity: req.body.cantidad,
                        product: req.body.idProducto,
                    },
                    {
                        quantity: 2,
                        product: '6181f60dc30dc200b1eb21a0',
                    },
                    {
                        quantity: 3,
                        product: '6181f60dc30dc200b1eb21a1',
                    }
                    ];

                return Cart.create({
                items: arrayAGuardar
            }).then(() => {
                    return res.status(200).json({
                        mensaje: 'todo bien'                        
                    });
                })
                .catch((err) => {
                    console.log(err.message);
                    return res.status(500).json({
                        mensaje: 'error interno'                        
                    });
                });
            });
            app.get('/obtenercarrito', (req, res) => {
                return Cart.findOne({usuario:req.query.usuario}).populate('items.product')
                .then((carrito) => { // esto te devuelve el carrito por usuario
                    return res.status(200).json(carrito);
                })
                .catch((err) => {
                    console.log(err.message);
                    return res.status(500).json({
                        mensaje: 'error interno'                        
                    });
                });
            });

            //aqui voy a crear la funcion de traer todos los productos a la vista del home y espero que funcion
            app.get('/home', (req, res) => {
                return Product.find().then((producto) =>{
                        return res.status(200).json(producto);
                }).catch((err) =>{
                    console.log(err.message);
                    return res.status(500).json({
                        mensaje:'error interno'
                    });
                })

            })


            // ejemplo http://localhost:3000/jose
            app.get('/nombre', (req, res) => {
                //hara un console log del param nombre en este caso "jose"
                //otro console log de lo que le llegue en el body
                console.log(req.body);

                //aca se pode interesante 
                // retorna todos los users ... User.find devuelve todos los registros de la tabla user
                // algo asi como (select * from user;) 
                // datito: si fuese User.find({nombre: 'jose'}) seria lo mismo que (select * from user where nombre = 'jose')
                return User.findOne({nombre: 'jose'})
                .then((usuariosEncontrados) => {
                    /* toda peticion a la api debe retornar algo esto se hace con 
                        res.status(numero).json({jsonAMandar}) donde numero es el numero de estado que queremos retornar
                        y el jsonAMandar es los datos en forma de json q mandaremos
                    */
                        return res.status(200).json(usuariosEncontrados);
                    /* return res.status(200).json({
                        //hola: 'hola mundo',
                        mensajeMostrar: usuariosEncontrados
                    }); */
                }).catch((err) => {
                    console.log(err.message);
                    return res.status(500).json({
                        mensaje: 'error interno'                        
                    });
                });
            });
            app.post('/login', (req, res) => {

                let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                const email = req.body.email.trim();
                const password = req.body.password.trim();
                var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                    Username : email,
                    Password : password,
                });
            
                var userData = {
                    Username : email,
                    Pool : userPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: function (result) {
                        return res.status(200).json({
                            accessToken: result.getAccessToken().getJwtToken(),
                            idToken: result.getIdToken().getJwtToken(),
                            refreshToken: result.getRefreshToken().getToken()
                        });
                    },
                    onFailure: function(err) {
                        console.log(err);
                        return res.status(500).json({
                            mensajeMostrar: 'Error login usuario'
                        });
                    },
                });
            
            });
            app.post('/check', (req, res) => {

                let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                const email = req.body.email.trim();
                const code = req.body.code;
            
                var userData = {
                    Username : email,
                    Pool : userPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.confirmRegistration(code, true, function(err, result) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            mensajeMostrar: 'Error verificar usuario'
                        });
                    }
                    console.log('callresult' + result);
                    return res.status(200).json({
                        mensajeMostrar: 'usuario verificado'
                    });
                });
            
            });
            app.post('/resendConfirmCode', (req, res) => {

                let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                const email = req.body.email.trim();
            
                var userData = {
                    Username : email,
                    Pool : userPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.resendConfirmationCode(function(err, result) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            mensajeMostrar: 'Error reenviar codigo'
                        });
                    }
                    console.log('callresult' + result);
                    return res.status(200).json({
                        mensajeMostrar: 'codigo reenviado'
                    });
                });
            
            });
            
            app.post('/forgotPassword', (req, res) => {

                let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                const email = req.body.email.trim();
            
                var userData = {
                    Username : email,
                    Pool : userPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.forgotPassword({
                    onSuccess: function(result) {
                        console.log('call result: ' + result);
                        return res.status(200).json({
                            mensajeMostrar: "olvido contraseña"
                        });
                    },
                    onFailure: function(err) {
                        console.log(err);
                        return res.status(500).json({
                            mensajeMostrar: "error olvido contraseña"
                        });
                    }
                });
            
            });
            app.post('/forgotPassword/confirm', (req, res) => {

                let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                const email = req.body.email.trim();
                const code = req.body.code;
                const newPassword = req.body.password.trim();
                var userData = {
                    Username : email,
                    Pool : userPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.confirmPassword(code,newPassword,{
                    onSuccess: function(result) {
                        console.log('call result: ' + result);
                        return res.status(200).json({
                            mensajeMostrar: "contraseña reestablecida"
                        });
                    },
                    onFailure: function(err) {
                        console.log(err);
                        return res.status(500).json({
                            mensajeMostrar: "error restablecer contraseña"
                        });
                    }
                });
            
            });
            
            app.post('/register', (req, res) => {
                    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                    const name = req.body.name.trim();
                    const lastName = req.body.lastName.trim();
                    const email = req.body.email.trim();
                    const password = req.body.password.trim();
                    const direccion = req.body.direccion.trim();
                    var carrito
                    var items = [];

                    var attributeList = [];
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value: name}));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"family_name",Value: lastName}));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value: direccion}));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value: email}));
                    
                    userPool.signUp(email, password, attributeList, null, 
                    function(err, result){
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                mensajeMostrar: 'Error registrar usuario'
                            });
                        }
                        carrito = new Cart({
                            items: items,
                            usuario: email
                        })
                        return carrito.save().then(() => {
                            return res.status(200).json({
                                mensajeMostrar: 'usuario registrado'
                            });
                        });
                    });
            });

            app.listen(process.env.SERVER_PORT, () => console.log(`Servidor corriendo en el puerto ${process.env.SERVER_PORT}`));
            return generatorUser();
        });


