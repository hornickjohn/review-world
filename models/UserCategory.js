const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class UserCategory extends Model {}

UserCategory.init(
  {
    id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    // define columns
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
        onDelete: 'set null'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id',
        onDelete: 'set null'
      }
    }
  },
  {
    sequelize
  }
);

module.exports = UserCategory;
