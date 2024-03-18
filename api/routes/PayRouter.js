const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Pay = require('../models/Pay')
const Cart = require('../models/Cart')
const ObjectId = mongoose.Types.ObjectId;

//verify token
const verifyToken = require('../middleware/verifyToken')


//post payment information
router.post('/', verifyToken , async(req,res)=>{
    console.log(req.body)
    const payment = req.body;
    console.log(payment)

    try {
        const paymentRequest = await Pay.create(payment);
        //delete cart item after payment
        const cartIds = payment.cartItems.map(id => new ObjectId(id))
        const deleteCartRequest = await Cart.deleteMany({_id: {$in: cartIds}})

        res.status(201).json(paymentRequest)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
})


//get order

router.get('/', verifyToken , async(req,res) =>{
    const email = req.query.email
    const query = {email: email}
    try {
        const decodedEmail = req.decoded.email;
        if(email !== decodedEmail){
            res.status(403).send({message:"Forbidden Access"})
        }
        const result = await Pay.find(query).sort({createdAt: -1}).exec()
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})

module.exports = router;