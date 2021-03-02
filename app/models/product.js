const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Product extends Model {};

Product.init({
  reference: DataTypes.TEXT,
  name: DataTypes.TEXT,
  description: DataTypes.STRING(600),
  stock: DataTypes.INTEGER,
  price: DataTypes.FLOAT(5,2),
}, {
  sequelize,
  tableName: "product"
});

module.exports = Product;