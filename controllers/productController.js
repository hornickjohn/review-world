const router = require("express").Router();
const { User, Category, Review, Product } = require("../models");

router.get("/", (req, res) => {
  Product.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res) => {
  if (!ensureLogin(req, res)) return;
  Product.create(req.body)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

function ensureLogin(req, res) {
  if (!req.session.loggedIn) {
    res.redirect("/login");
    return false;
  }
  return true;
}

module.exports = router;
