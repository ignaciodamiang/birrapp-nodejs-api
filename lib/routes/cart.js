'use strict';
const express = require('express');
const router = express.Router();
const Cart = require('@models/carrito');
const Order = require('@models/pedido');

router.post('/carrito', (req, res) => {
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


router.get('/obtenercarrito', (req, res) => {
    return Cart.findOne({subUsuario:req.userToken.userSub}).populate('items.product')
    .then((carrito) => { // esto te devuelve el carrito por usuario
        if(!carrito){
            return res.status(400).json({
                mensaje: 'error carrito de usuario no encontrado'                        
            });
        }
        return res.status(200).json(carrito);
    })
    .catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            mensaje: 'error interno'                        
        });
    });
});

router.post('/agregaracarrito', (req, res) => {
    return Cart.findOne({subUsuario: req.userToken.userSub})
    .then((carrito) => {
        let repetido = false;
        const json = {
            product: req.body.idProducto,
            quantity: req.body.cantidad
        };
        carrito.items.forEach((item) => {
            if(item.product.toString() === req.body.idProducto){
                item.quantity = item.quantity + 1;
                repetido = true;
            }
        });
        if(!repetido){
            carrito.items.push(json);        
        }
        return carrito.save()
        .then(()=> { 
            return res.status(200).json({
                mensaje: 'carrito actualizado'
            });
        });
    })
    .catch((err)=> {
        console.error(err);
        return res.status(500).json({
            mensaje: err.message
        });
    });
});

router.post('/repetirPedido', (req, res) =>{
    let pedidoObtenido;
    return Order.findOne({_id: req.body.idPedido}).populate('items.product')
    .then((pedido) => {
        pedidoObtenido = pedido;
        return Cart.findOne({subUsuario:req.userToken.userSub}).populate('items.product').
        then((carrito) => {
            carrito.items = pedidoObtenido.items;
            carrito.save()
        })
        .then(() => {
            return res.status(200).json({mensaje: 'pedido repetido correctamente'});
        });
      })
      .catch((err) => {
        console.log(err.message);
        return res.status(500).json({
          mensaje: "error al repetir pedido",
        });
      });
    });


router.post('/cambiarcantidad', (req,res) => {
    return Cart.findOne({subUsuario:req.userToken.userSub}).populate('items.product')
    .then((carrito) => { // esto te devuelve el carrito por usuario
        if(!carrito){
            return res.status(400).json({
                mensaje: 'error carrito de usuario no encontrado'                        
            });
        }
        let itemFound = carrito.items.findIndex((item)=> {
            return item._id.toString() === req.body.idItem;
        });
            if(req.body.operacion === 'mas'){
                carrito.items[itemFound].quantity += 1;
            }
            if(req.body.operacion === 'menos'){
                carrito.items[itemFound].quantity -= 1;
                if(carrito.items[itemFound].quantity === 0){
                    carrito.items.splice(itemFound, 1);
                }
            }
            if(req.body.operacion === 'eliminar'){
                carrito.items.splice(itemFound, 1);
            }
            return carrito.save()
            .then(() => {
                return res.status(200).json(carrito);
            });
    })
    .catch((err) => {
        console.log(err.message);
        return res.status(500).json({
            mensaje: 'error interno'                        
        });
    });
});

module.exports = router;
