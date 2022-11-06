"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rent extends Model {
    static associate(models) {
      Rent.belongsTo(models.User, {
        targetKey: "id" //Apunta a mi modelo interno
      });
      Rent.belongsTo(models.Movie, {
        targetKey:"MovieCode",
      });
    }
  }
  Rent.init(
    {
      RentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      MovieMovieCode: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
      },
      rent_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      refund_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userRefund_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Rent",
    }
  );
  return Rent;
};
