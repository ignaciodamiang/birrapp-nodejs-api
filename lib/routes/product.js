"use strict";
const express = require("express");
const router = express.Router();
const Product = require("@models/producto"); //traigo el modelo user
router.post("/nuevoproducto", (req, res) => {
  if (!(req.userToken.userRol === "admin")) {
    return res.status(401).json({
      error: "Error 401",
    });
  }
  return Product.create({
    description: req.body.descripcion,
    name: req.body.nombre,
    price: req.body.precio,
    type: req.body.tipo,
    imagePath: req.body.imagePath
  })
    .then(() => {
      return res.status(200).json({
        mensaje: "todo bien",
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({
        mensaje: "error interno",
      });
    });
});

//aqui voy a crear la funcion de traer todos los productos a la vista del home y espero que funcion
router.get("/home", (req, res) => {
  return Product.find()
    .then((producto) => {
      return res.status(200).json(producto);
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({
        mensaje: "error interno",
      });
    });
});

/*aqui voy a intentar hacer el filtro de productos por nombres*/
router.post("/Productos", (req, res) => {
  //aqui creo una variable para atrapar el nombre que se recibe
    let searchWord = req.body.nombre;
    //aqui se crea una variable que sera un array
    let products;
    //aqui establezco que el parametro no llegue nulo, vacio y que sea preciso
    if(searchWord !== null && searchWord !== '' && searchWord) {
        searchWord = searchWord.trim();
        //aqui hago la query buscando los productos por nombres
        products = Product.find({producto: searchWord, name: new RegExp(searchWord, 'i')})
            .sort({createdAt: -1});
        //sino cumple trae todo los productos
    } else {
        products = Product.find({producto: searchWord}).sort({createdAt: -1});
    }
//aqui si todo esta cumplida la condicion y trae por nombre, devuelve el json 
    return products.then((data) => {
        return res.status(200).json(data);
    }).catch((err) => {
        logger.error(`PRODUCTS OF RESTAURANT - ERROR ${err.message}`);
        return res.status(500).json({
            errorCode: 500,
            userMessage: 'Internal error'
        });
    });

});

module.exports = router;
