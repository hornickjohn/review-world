const express = require('express');
const router = express.Router();
const {Category,User,Review,Product} = require('../models');

router.get("/",(req,res)=>{
    res.render("home");
});
router.get("/login",(req,res)=>{
    res.render("login");
});
router.get("/signup",(req,res)=>{
    res.render("signup");
});
router.get("/profile/:username",(req,res)=>{
    User.findOne({
        where:{
            username: req.params.username
        },  
        include:[Product]
    }).then(userData=>{
        if(userData) {
            res.render("profile", {
                userData: userData.toJSON()
            });
        } else {
            res.status(404).json('User not found.');
        }
    }).catch(err=>{
        res.status(500).json('Server error.');
    });
});
router.get("/account",(req,res)=>{
    if(!req.session.userId) {
        res.redirect("/login");
    } else {
        res.render("updateuser");
    }
});
router.get("/search",(req,res)=>{
    res.render("search");
});

module.exports = router;