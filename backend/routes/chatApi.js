const express = require('express');
const router = express.Router();

const userModel = require('../models/user')

// show selected user only
router.get('/chat/:id', async(req, res)=>{
    try {
        let id = req.params.id
    console.log("id from chat api ",id)
    let user = await userModel.find({_id:id})
    res.send(user)
    } catch (error) {
        console.log(error)
    }
    
})

// show all users in the chat list
router.get('/users', async(req, res)=>{
    try {
        console.log("ok")
    let data = await userModel.find();
    // console.log(data)
    res.send(data)
    } catch (error) {
        console.log(error)
    }
    

})




module.exports = router