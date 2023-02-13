const express = require('express');
const router = express.Router();
const {Category,User,Review,Product} = require('../models');

router.get("/", async(req,res)=>{
    if(!ensureLogin (req, res)) return;
    const user = await User.findOne({
        where: { id: req.session.userId }
      });
      const userData = user.get({ plain: true });
      userData.loggedIn = req.session.loggedIn;

      const reviewData = await Review.findAll({
        include:[User,Product],
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 10
      });
      const hbsReviews = reviewData.map(review=>review.toJSON())

    res.render("home", { userData, reviewData:hbsReviews });
});
router.get("/login",(req,res)=>{
    res.render("login");
});
router.get("/signup",(req,res)=>{
    res.render("signup");
});
router.get("/profile/:username",(req,res)=>{
    if(!ensureLogin (req, res)) return;
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
    if(!ensureLogin (req, res)) return;
    res.render("updateuser");
});

router.get("/search",(req,res)=>{
    if(!ensureLogin (req, res)) return;
    res.render("search");
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


function ensureLogin(req, res){
    if (!req.session.loggedIn) {
        res.redirect("/login");
        return false;
    }
    return true;
} 

module.exports = router;