const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Product extends Model {}

Product.init({
    // add properites here, ex:
    name: {
         type: DataTypes.STRING,
         allowNull:false,
         validate:{
            len:[1,60]
         }
    }
},{
    sequelize
});

module.exports=Product