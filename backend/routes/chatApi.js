const express = require('express');
const router = express.Router();

const userModel = require('../models/user')

router.post('/chat/:id', async(req, res)=>{
    console.log("ok")
    console.log(req.params)


})

router.get('/users', async(req, res)=>{
    console.log("ok")
    let data = await userModel.find();
    console.log(data)
    res.send(data)


})




module.exports = router