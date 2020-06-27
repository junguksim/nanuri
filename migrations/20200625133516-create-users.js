'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userIdx: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      userPw: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      userLongitude: {
        type: Sequelize.DOUBLE
      },
      userLatitude: {
        type: Sequelize.DOUBLE
      },
      userName: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};