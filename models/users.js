'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    userIdx: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.STRING,
    userPw: DataTypes.STRING,
    salt: DataTypes.STRING,
    userLongitude: DataTypes.DOUBLE,
    userLatitude: DataTypes.DOUBLE,
    userName: DataTypes.STRING
  }, {});
  users.associate = function(models) {
    users.belongsToMany(models.rooms, {
      "through" : "users_rooms",
      "foreignKey" : "fk_userIdx",
      "onDelete" : "cascade"
    })
  };
  return users;
};