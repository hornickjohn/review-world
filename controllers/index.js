const express = require('express');
const router = express.Router();

const userRoutes = require('./userController');
router.use("/api/users",userRoutes);

const categoryRoutes = require('./categoryController');
router.use("/api/category",categoryRoutes);

const reviewRoutes = require('./reviewController');
router.use("/api/review",reviewRoutes);

const frontEndRoutes = require('./frontEndController');
router.use("/",frontEndRoutes);

router.get("*",(req,res) => {
    res.redirect("/");
});

module.exports = router;