const User = require("./User");
const Review = require("./Review");
const Category = require("./Category");
const Product = require("./Product");

Product.belongsTo(Category,{
    onDelete:"CASCADE"
});
Category.hasMany(Product);

Review.belongsTo(Product, {
    onDelete:"CASCADE"
});
Product.hasMany(Review);

Review.belongsTo(User,{
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