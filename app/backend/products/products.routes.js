import { getAllPrices } from './products.model';

const express = require('express');
const productModels = require('./products.model');
const products = express.Router();


products.get('/products', (req, res) => { 
    res.send('Products!!!')
});

products.get('/products/', (req, res) => {
    try {
        res.render

    }
    catch {

    }
})

module.exports = products;