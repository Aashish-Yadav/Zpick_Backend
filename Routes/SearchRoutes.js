const express = require('express');
const router = express.Router();
const product = require('../model/Product')



router.get('/search' , async(req , res) => {
    const {q} = req.query;
    console.log(q);

    const query = {}

    if(q){
        query.name = {$regex:q, $options:'i'};
    }

    try {
        const products =  await product.find(query);
        res.json(products)
    } catch (error) {
        return res.status(500).json({ error: 'Server error happening' });
    }
})


module.exports = router