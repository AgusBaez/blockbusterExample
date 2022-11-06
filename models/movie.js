"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      //Movie.belongsToMany(models.Rent, { through: "Rent" });
    }
  }
  Movie.init(
    {
      MovieCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      rentals: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
