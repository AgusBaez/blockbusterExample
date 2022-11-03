"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FavouriteFilms extends Model {
    static associate(models) {
      FavouriteFilms.hasMany(models.Movie, {
        foreignKey: "MovieCode",
        target_key: "code",
      });
      FavouriteFilms.hasMany(models.User, {
        foreignKey: "id_user",
        target_key: "id",
      });
    }
  }
  FavouriteFilms.init(
    {
      MovieCode: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      review: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "FavouriteFilms",
    }
  );
  return FavouriteFilms;
};
