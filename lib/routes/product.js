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

module.exports = router;
