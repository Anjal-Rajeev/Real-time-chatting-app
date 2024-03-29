const express = require('express')
const router = express.Router()
var jwt = require('jsonwebtoken');
const CODE = "this is a realtime chatting application"
const userModel = require('../models/user')
const verifyToken = require('../middlewares/jwtVerify')


router.post('', async(req, res)=>{
    try {
        
        
        let data = req.body
        let payload = {
            'email': data.email,
            'password': data.password
        }
        console.log("backend",data)
        let existEmail = await userModel.find({email : data.email})
        let existUserName = await userModel.find({userName : data.userName})
        
       
        if(existEmail != "" || existUserName != ""){
            console.log("exists")
            if(existEmail != ""){
                console.log("Email already exists")
                res.json({"status" : "1"})
            }else if(existUserName != ""){
                console.log("User name already exists");
                res.json({"status" : "2"})
            }
        }
        else{ 
            console.log("New user");
            const newUser = new userModel(data)
            const savedUser = await newUser.save()
            let token = jwt.sign(payload,CODE)
            res.status(200).send([savedUser,token])  
            console.log(savedUser)
            console.log("successfull");
        }
  

    } catch (error) {
        console.log(error)
        res.json({"status":"error"})
    }
})

router.post('/delete-account',verifyToken, async(req, res)=>{

    try {
        console.log("body from delete",req.body);
        let id = req.body.id
        console.log("id from body", id);
        let deletedUser =await userModel.deleteOne({_id:id})
        console.log(deletedUser);
        res.status(200).send({"status":"successfully deleted"})
    } catch (error) {
        console.log(error)
        res.status(500)
    }
})









module.exports=router