const User = require("./User");
const Review = require("./Review");
const Category = require("./Category");
const Product = require("./Product");
const UserCategory = require("./UserCategory");

//product is in a category
Product.belongsTo(Category,{
    onDelete:"CASCADE"
});
Category.hasMany(Product);

//product has reviews
Review.belongsTo(Product, {
    onDelete:"CASCADE"
});
Product.hasMany(Review);

//user has posted reviews
Review.belongsTo(User,{
    onDelete:"SET NULL"
});
User.hasMany(Review);

//user has favorite products
Product.belongsTo(User,{
    onDelete:"SET NULL"
});
User.hasMany(Product);

//setup usercategory junction
User.belongsToMany(Category, {
    through: UserCategory,
    foreignKey: 'user_id'
});
Category.belongsToMany(User, {
    through: UserCategory,
    foreignKey: 'category_id'
});

module.exports = {
    User,
    Review,
    Category,
    Product
}