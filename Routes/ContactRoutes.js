const express = require('express');
const router = express.Router();
const Contact = require('../model/Contact');


router.post('/contact', async (req, res) => {
    try{
        console.log('Request Body :',req.body);
        const {name, email, phone, subject, message} = req.body;

        if(!name || !email || !phone || !subject || !message ) return res.status(400).json({status:false, message :"All fields are required"});

        const query = new Contact({name, email, phone, subject, message})
        console.log('queryyyyy',query)
        await query.save();

        return res.status(201).json({status:true, message:"Query Registered successfully"})
    } catch (error){
        console.log(error);
        return res.status(400).json({
            status:false,
            message:"something went wrong in contact backend"
        })
    }
})

module.exports = router;