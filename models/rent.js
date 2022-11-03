"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rent extends Model {
    static associate(models) {
      Rent.belongsTo(models.User, {
        foreignKey: "id_user", //Clave relacion de mi modelo interno
        targetKey: "id_user", //Clave de la relacion al modelo externo
      });
      Rent.belongsTo(models.Movie, {
        foreignKey: "MovieCode",
        targetKey: "MovieCode",
      });
    }
  }
  Rent.init(
    {
      id_rent: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      MovieCode: {
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
