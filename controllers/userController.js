const express = require('express');
const router = express.Router();
const request = require('request');
const {User,Category,Review} = require('../models');
const bcrypt = require("bcrypt");
require('dotenv').config();

router.get("/",(req,res)=>{
   User.findAll().then(userData=>{
    res.json(userData)
   }).catch(err=>{
    console.log(err);
    res.status(500).json({msg:"error!",err})
   })
})

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.send("logged out")
})


router.get("/:id",(req,res)=>{
   User.findByPk(req.params.id,{
    include:[Review]
   }).then(userData=>{
    res.json(userData)
   }).catch(err=>{
    console.log(err);
    res.status(500).json({msg:"oh noes!",err})
   })
})

router.post("/",async (req,res)=>{
    console.log(req.body.token);
    request.post({
        url:`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`,    
        headers: {
            'Content-Type': 'application/json'
        }
    }, function(error, response, body) {
        const success = JSON.parse(body).success;
        if(!success) {
            res.status(400).json({msg:"captcha error",error});
        } else {
            User.create(req.body)
            .then(userData=>{
                req.session.userId = userData.id;
                req.session.userEmail = userData.email;
                req.session.loggedIn = true;
                res.json(userData);
            }).catch(err=>{
                console.log(err);
                res.status(500).json({msg:"Server error attempting to create account.",err});
            });
        }
    });
})
router.post("/login",(req,res)=>{
   User.findOne({
   where:{
    email:req.body.email
   }
   }).then(userData=>{
    if(!userData){
        return res.status(401).json({msg:"incorrect email or password"})
    } else {
        if(bcrypt.compareSync(req.body.password,userData.password)){
            req.session.userId = userData.id;
            req.session.userEmail = userData.email;
            req.session.loggedIn = true;
            return res.json(userData)
        } else {
            return res.status(401).json({msg:"incorrect email or password"})
        }
    }
   }).catch(err=>{
    console.log(err);
    res.status(500).json({msg:"oh noes!",err})
   })
})




module.exports = router;