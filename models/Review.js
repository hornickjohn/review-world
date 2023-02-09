const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model {}

Review.init({
    // add properites here, ex:
    body: {
         type: DataTypes.STRING,
         allowNull:false,
         validate:{
            len:[1,2000]
         }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            max:5,
            min:1
        }
    }
},{
    sequelize
});

module.exports=Review