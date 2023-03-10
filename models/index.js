const User = require("./User");
const Review = require("./Review");
const Category = require("./Category");
const Product = require("./Product");
//const UserCategory = require("./UserCategory");

//product is in a category
Product.belongsTo(Category,{
  foreignKey: "category_id",
});
Category.hasMany(Product,{
    foreignKey: "category_id",
    onDelete:"CASCADE"
  });

//product has reviews
Review.belongsTo(Product, {
  foreignKey: "product_id",
});
Product.hasMany(Review, {
    foreignKey: "product_id",
    onDelete:"CASCADE"
  });

//user has posted reviews
Review.belongsTo(User,{
  foreignKey: "user_id",
});
User.hasMany(Review,{
    foreignKey: "user_id",
    onDelete:"CASCADE"
  });

//user has favorite products
//Product.belongsTo(User,{
 //   onDelete:"SET NULL"
//});
//User.hasMany(Product);

//setup usercategory junction
//User.belongsToMany(Category, {
 //   through: UserCategory,
 //   foreignKey: 'user_id'
//});
//Category.belongsToMany(User, {
//    through: UserCategory,
 //   foreignKey: 'category_id'
//});

module.exports = {
    User,
    Review,
    Category,
    Product
}