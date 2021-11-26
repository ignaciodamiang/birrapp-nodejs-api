'use strict';
const express = require('express');
const router = express.Router();
const Order = require('@models/pedido');
const Cart = require('@models/carrito');
const carrito = require('../models/carrito');

router.post('/guardarPedido',(req, res) =>{
    let carritoObtenido;
    return Cart.findOne({subUsuario:req.userToken.userSub}).populate('items.product')
    .then((carrito) =>{
        carritoObtenido = carrito;
        return Order.create({
            items : carrito.items,
            subUsuario : req.userToken.userSub,
            direccion : req.body.direccion,
            aclaraciones: req.body.aclaraciones
        })
    })
    .then(() => {
        /* return res.status(200).json({
          mensaje: "pedido agregado correctamente",
        }); */
        carritoObtenido.items = [];
        return carritoObtenido.save()
        .then(() => {
            return res.status(200).json({mensaje: 'pedido agregado correctamente'});
        });
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(500).json({
          mensaje: "error al agregar pedido",
        });
      });
    }
);

router.get('/obtenerPedidos', (req, res) => {
  return Order.find({subUsuario:req.userToken.userSub}).populate('items.product')
  .then((pedidos) => {
    return res.status(200).json(pedidos);
  })
  .catch((err) => {
    console.log(err.message);
    return res.status(500).json({
        mensaje: 'error interno'                        
    });
});
});


module.exports = router;