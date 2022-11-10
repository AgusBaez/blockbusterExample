"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rents", {
      RentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      UserUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      MovieMovieCode: {
        type: Sequelize.STRING,
        allowNull: false,
        foreignKey: true,
      },
      rent_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      refund_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userRefund_date: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      RentId: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Rents");
  },
};
