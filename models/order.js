'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items'
      });
    }
  }
  Order.init({
    customerName: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};