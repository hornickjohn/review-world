const express = require('express');
const router = express.Router();
const {Category,User,Review,Product} = require('../models');
require('dotenv').config();
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE,process.env.RECAPTCHA_SECRET, {callback:'captchaCallback'});

router.get("/", async(req,res)=>{
    if(!ensureLogin (req, res)) return;
    const currentUserData = await getUserData(req);

      const reviewData = await Review.findAll({
        include:[User,Product],
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 10
      });
      const hbsReviews = reviewData.map(review=>review.toJSON())

    res.render("home", { currentUserData, reviewData:hbsReviews });
});
router.get("/login",async (req,res)=>{
    const currentUserData = await getUserData(req);
    res.render("login", { currentUserData });
});
router.get("/signup",async (req,res)=>{
    const currentUserData = await getUserData(req);
    res.render("signup", { currentUserData, captcha: recaptcha.render() });
});
router.get("/profile/:username",async (req,res)=>{
    const currentUserData = await getUserData(req);
    User.findOne({
        where:{
            username: req.params.username
        },  
        include:[Review]
    }).then(userData=>{
        if(userData) {
            let hbsUserData = userData.toJSON();
            res.render("profile", {
                currentUserData,
                userData:hbsUserData
            });
        } else {
            res.status(404).json('User not found.');
        }
    }).catch(err=>{
        res.status(500).json('Server error.');
    });
});

router.get("/profile",async (req,res)=>{
    if(!ensureLogin (req, res)) return;
    const currentUserData = await getUserData(req);
    User.findOne({
        where:{
            id: req.session.userId
        },  
        include:[Review]
    }).then(userData=>{
        if(userData) {
            let hbsUserData = userData.toJSON();
            res.render("profile", {
                currentUserData,
                userData:hbsUserData
            });
        } else {
            res.status(404).json('User not found.');
        }
    }).catch(err=>{
        res.status(500).json('Server error.');
    });
});

router.get("/addreview",async (req,res)=>{
    if(!ensureLogin (req, res)) return;
    const currentUserData = await getUserData(req);
    Category.findAll()
    .then(catData=>{
        catData = catData.map(category=>category.toJSON());
        res.render("addreview",{currentUserData,catData});
    });
});

router.get("/account",async (req,res)=>{
    if(!ensureLogin (req, res)) return;
    const currentUserData = await getUserData(req);
    res.render("updateuser", { currentUserData });
});

router.get("/search",async (req,res)=>{
    if(!ensureLogin (req, res)) return;
    const currentUserData = await getUserData(req);
    res.render("search", { currentUserData });
});

router.get("/logout", (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.redirect("/login");
      });
    } else {
        res.redirect("/login");
    }
  });

async function getUserData(req) {
    if(req.session.loggedIn)
    {
    const user = await User.findOne({
        where: { id: req.session.userId }
      });
      const userData = user.get({ plain: true });
      userData.loggedIn = req.session.loggedIn;
      return userData;
    }
    return {};
}


function ensureLogin(req, res){
    if (!req.session.loggedIn) {
        res.redirect("/login");
        return false;
    }
    return true;
} 

module.exports = router;