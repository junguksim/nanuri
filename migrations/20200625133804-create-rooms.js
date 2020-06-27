'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomIdx: {
        type: Sequelize.INTEGER
      },
      roomName: {
        type: Sequelize.STRING
      },
      currentPeople: {
        type: Sequelize.INTEGER
      },
      maxPeople: {
        type: Sequelize.INTEGER
      },
      roomType: {
        type: Sequelize.INTEGER
      },
      roomStatus: {
        type: Sequelize.INTEGER
      },
      roomItem: {
        type: Sequelize.STRING
      },
      itemPrice: {
        type: Sequelize.INTEGER
      },
      pricePerPerson: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('rooms');
  }
};