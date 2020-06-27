'use strict';
module.exports = (sequelize, DataTypes) => {
  const rooms = sequelize.define('rooms', {
    roomIdx: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    roomName: DataTypes.STRING,
    currentPeople: DataTypes.INTEGER,
    maxPeople: DataTypes.INTEGER,
    roomType: DataTypes.INTEGER,
    roomStatus: DataTypes.INTEGER,
    roomItem: DataTypes.STRING,
    itemPrice: DataTypes.INTEGER,
    pricePerPerson: DataTypes.INTEGER
  }, {});
  rooms.associate = function(models) {
    rooms.belongsToMany(models.users, {
      "through" : "users_rooms",
      "foreignKey" : "fk_roomIdx",
      "onDelete" : "cascade"
    })
  };
  return rooms;
};