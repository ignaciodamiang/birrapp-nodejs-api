'use strict';
const User = require('@models/user'); //traigo el modelo user

function generatorUser() {
    // meto en una variable un nuevo user creado a partir de un json 
let newUser = new User({
    nombre: 'cosme',
    apellido: 'fulanito',
    password: '123456',
    email: 'email@gmail.com'
});
/* 
Bienvenido a la primera promesa ahre q en el index.js ya hay 
User.count igual q mysql indica cuantos registros cumplen con la condicion
 */
                    // con mongo las condiciones seran basicamente asi {campo: algo} (where campo = algo)
                    // tambien hay otros filtros y demas ...ver documentacion de mongoose para saber mas    
return User.count({email: 'email@gmail.com'})
    .then((count) => { 
        if (count === 0) {
            return newUser.save() //variable creada anteriormente tiene un user ...este user puede invocar el
                                  // metodo save() para guardarse en la base de datos
                .then(() => {
                    console.info('CREATE USER SUCCESSFULLY');
                })
                .catch((err) => {
                    console.error(`CREATE USER - ERROR ${err.message}`);
                });
        }
        console.info('CREATE USER - ALREADY EXISTS');
        return null;
    })
    .catch((err) => {
        console.error(`CREATE USER COUNT - ERROR ${err.message}`);
    });
}
module.exports = {
    generatorUser
};