'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
      this.hasMany(models.OrderItem, {
        foreignKey: 'productId',
        as: 'orderItems'
      });
      this.hasMany(models.StockMovement, {
        foreignKey: 'productId',
        as: 'stockMovements'
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    stockQuantity: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING 
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};