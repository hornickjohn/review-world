const express = require('express');
const router = express.Router();
const {Category,User,Review,Product} = require('../models');
require('dotenv').config();
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE,process.env.RECAPTCHA_SECRET, {callback:'captchaCallback'});

router.get("/", async(req,res)=>{
    const currentUserData = await getUserData(req);
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());

      const reviewData = await Review.findAll({
        include:[User,Product],
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 10
      });
      const hbsReviews = reviewData.map(review=>review.toJSON())

    res.render("home", { currentUserData, reviewData:hbsReviews, categoryData });
});
router.get("/login",async (req,res)=>{
    const currentUserData = await getUserData(req);
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());
    res.render("login", { currentUserData, categoryData });
});
router.get("/signup",async (req,res)=>{
    const currentUserData = await getUserData(req);
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());
    res.render("signup", { currentUserData, captcha: recaptcha.render(), categoryData });
});
router.get("/profile/:username",async (req,res)=>{
    const currentUserData = await getUserData(req);
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());
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
                userData:hbsUserData,
                categoryData
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
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());
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
                userData:hbsUserData,
                categoryData
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
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());
    res.render("addreview", { currentUserData, categoryData });
});

router.get("/account",async (req,res)=>{
    if(!ensureLogin (req, res)) return;
    const currentUserData = await getUserData(req);
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());
    res.render("updateuser", { currentUserData, categoryData });
});

router.get("/search",async (req,res)=>{
    const currentUserData = await getUserData(req);
    const categoryDataRaw = await Category.findAll();
    const categoryData = categoryDataRaw.map(category => category.toJSON());

    const sequelize = require('../config/connection.js');
    const { Op } = require("sequelize");

    let categoryName = false;
    if(req.query.category) {
        let category = await Category.findOne({
            where:{
                name:req.query.category
            }
        });
        if(category) {
            categoryName = {
                [Op.eq]:category.name
            };
        }
    }

    //Create product name restraints
    let searchWheres = [];
    if(req.query.term) {
        const strs = req.query.term.toLowerCase().split(' ');
        for(let i = 0; i < strs.length; i++) {
            searchWheres.push(sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + strs[i] + '%'));
        }
    }
    let productName = false;
    if(searchWheres.length > 0) {
        productName = {
            [Op.and]:searchWheres
        };
    }

    //Create rating constraints
    let rating = false;
    if(parseInt(req.query.max) && parseInt(req.query.min)) {
        rating = {
            [Op.gte]:parseInt(req.query.min),
            [Op.lte]:parseInt(req.query.max)
        };
    } else if(parseInt(req.query.max)) {
        rating = {
            [Op.lte]:parseInt(req.query.max)
        };
    } else if(parseInt(req.query.min)) {
        rating = {
            [Op.gte]:parseInt(req.query.min)
        };
    }

    let P = false;
    if(rating && productName && categoryName) {
        P = {
            where: {
                rating
            },
            include: [
                {
                    model:Product,
                    where: {
                        name:productName
                    },
                    include: [ 
                        {
                            model:Category,
                            where: {
                                name:categoryName
                            }
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else if(productName && categoryName) {
        P = {
            include: [
                {
                    model:Product,
                    where: {
                        name:productName
                    },
                    include: [ 
                        {
                            model:Category,
                            where: {
                                name:categoryName
                            }
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else if(rating && categoryName) {
        P = {
            where: {
                rating
            },
            include: [
                {
                    model:Product,
                    include: [ 
                        {
                            model:Category,
                            where: {
                                name:categoryName
                            }
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else if(rating && productName) {
        P = {
            where: {
                rating
            },
            include: [
                {
                    model:Product,
                    where: {
                        name:productName
                    },
                    include: [ 
                        {
                            model:Category
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else if(rating) {
        P = {
            where: {
                rating
            },
            include: [
                {
                    model:Product,
                    include: [ 
                        {
                            model:Category
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else if(productName) {
        P = {
            include: [
                {
                    model:Product,
                    where: {
                        name:productName
                    },
                    include: [ 
                        {
                            model:Category
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else if(categoryName) {
        P = {
            include: [
                {
                    model:Product,
                    include: [ 
                        {
                            model:Category,
                            where: {
                                name:categoryName
                            }
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    } else {
        P = {
            include: [
                {
                    model:Product,
                    include: [ 
                        {
                            model:Category
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
    }

    const revData = await Review.findAll(P).catch(err=>{console.log(err);});
    console.log(revData);
    const hbsSearchReviews = revData.map(dat=>dat.toJSON());

    res.render("search", { currentUserData, reviewData:hbsSearchReviews, categoryData });
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