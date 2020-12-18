'use strict';
module.exports = (sequelize, DataTypes) => {
  const items = sequelize.define('items', {
    itemIdx: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    price: DataTypes.INTEGER,
    maxPeopleCount: DataTypes.INTEGER,
    nowPeopleCount: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    fk_userIdx: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  items.associate = function (models) {
    items.hasMany(models.itemPictures, {
      "foreignKey": "fk_itemIdx",
      "onDelete": "cascade"
    })
  };
  return items;
};