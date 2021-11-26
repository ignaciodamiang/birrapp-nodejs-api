'use strict';
const Auth = require('./auth')
const Product = require('./product');
const Cart = require('./cart');
const Order = require('./order');
const UploadFile = require('./upload-file')

module.exports = {
    Auth,
    Product,
    Cart,
    Order,
    UploadFile
};

