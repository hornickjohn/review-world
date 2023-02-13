const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {}

User.init({
    first_name: {
        type:DataTypes.STRING,
        validate:{
            isAlpha:true,
            len:[0,50]
        }
    },
    last_name: {
        type:DataTypes.STRING,
        validate:{
            isAlpha:true,
            len:[0,50]
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isAlphanumeric:true,
            len:[3,15]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
           isEmail:true
        }
    },
    password:{
       type:DataTypes.STRING,
       allowNull:false,
       validate:{
           len:[1,256] //changed temp for testing
       }
    },
    showname: {
        type: DataTypes.BOOLEAN
    }
},{
    sequelize,
    hooks:{
        beforeCreate:userObj=>{
            userObj.password = bcrypt.hashSync(userObj.password,4);
            return userObj;
        }
    }
});

module.exports=User