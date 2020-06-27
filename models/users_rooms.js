'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_rooms = sequelize.define('users_rooms', {
    fk_userIdx: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fk_roomIdx: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    }
  }, {});
  users_rooms.associate = function(models) {
    users_rooms.belongsTo(models.users, {
      foreignKey : 'fk_userIdx',
      onDelete : 'cascade'
    });
    users_rooms.belongsTo(models.rooms, {
      foreignKey : 'fk_roomIdx',
      onDelete : 'cascade'
    })
  };
  return users_rooms;
};