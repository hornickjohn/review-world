const express = require("express");
const router = express.Router();
const { Category, User, Review, Product } = require("../models");

router.get("/", async (req, res) => {
  if (!ensureLogin(req, res)) return;
  const user = await User.findOne({
    where: { id: req.session.userId },
  });
  const userData = user.get({ plain: true });
  userData.loggedIn = req.session.loggedIn;

  res.render("home", userData);
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/category", async (req, res) => {
  if (!ensureLogin(req, res)) return;
  const categories = await Category.findAll();
  const categoryData = categories.map((category) => {
    return category.get({ plain: true });
  });
  res.render("category", {
    categoryData: categoryData,
    loggedIn: true,
  });
});

router.get("/category", async (req, res) => {
  if (!ensureLogin(req, res)) return;
  const categories = await Category.findAll();
  const categoryData = categories.map((category) => {
    return category.get({ plain: true });
  });
  res.render("category", {
    categoryData: categoryData,
    loggedIn: true,
  });
});

router.get("/product", async (req, res) => {
  if (!ensureLogin(req, res)) return;
  const categories = await Category.findAll();
  const categoryData = categories.map((category) => {
    return category.get({ plain: true });
  });
  const products = await Product.findAll({
    include: [Category]
  });
  const productData = products.map((product) => {
    return product.get({ plain: true });
  });
  res.render("product", {
    categoryData: categoryData,
    productData: productData,
    loggedIn: true,
  });
});

router.get("/review", async (req, res) => {
  if (!ensureLogin(req, res)) return;
  const selectedProduct = req.query.product_id || 0
  console.log(selectedProduct)
  const products = await Product.findAll({
    include: [Category]
  });
  const productData = products.map((product) => {
    const p = product.get({ plain: true });
    if (p.id == selectedProduct)
    {
      p.selectedProduct = true
    }
    return p;
  });

  const reviews = await Review.findAll({
    where: {
      product_id: selectedProduct,
    },
    include: [
      {
        model: Product,
        include: [Category],
      },
      User,
    ],
  });
  const reviewData = reviews.map((review) => {
    return review.get({ plain: true });
  });
  //console.log(productData);
  //console.log(reviewData);
  res.render("review", {
    productData: productData,
    reviewData: reviewData,
    loggedIn: true,
    selectedProduct: selectedProduct,
  });
});

router.get("/profile/:username", (req, res) => {
  if (!ensureLogin(req, res)) return;
  User.findOne({
    where: {
      username: req.params.username,
    },
    include: [Product],
  })
    .then((userData) => {
      if (userData) {
        res.render("profile", {
          userData: userData.toJSON(),
        });
      } else {
        res.status(404).json("User not found.");
      }
    })
    .catch((err) => {
      res.status(500).json("Server error.");
    });
});

router.get("/account", (req, res) => {
  if (!ensureLogin(req, res)) return;
  res.render("updateuser");
});

router.get("/search", (req, res) => {
  if (!ensureLogin(req, res)) return;
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

function ensureLogin(req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/login");
    return false;
  }
  return true;
}

module.exports = router;
