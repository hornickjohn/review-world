const sequelize = require("../config/connection");
const { User, Category, Product, Review } = require("../models");

const userData = require("./userData.json");
const categoryData = require("./categoryData.json");
const productData = require("./productData.json");
const reviewData = require("./reviewData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const categories = await Category.bulkCreate(categoryData, {
    individualHooks: true,
    returning: true,
  });

  const products = await Product.bulkCreate(productData, {
    individualHooks: true,
    returning: true,
  });

  const reviews = await Review.bulkCreate(reviewData, {
    individualHooks: true,
    returning: true,
  });

  // for (const post of postData) {
  //     await Post.create ({   
  //         ...post,
  //         user_id: users[Math.floor(Math.random() * users.length)].id,

  //     });
  // }

  process.exit(0);
};

seedDatabase();
