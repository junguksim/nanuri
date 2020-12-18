'use strict';
module.exports = (sequelize, DataTypes) => {
  const itemPictures = sequelize.define('itemPictures', {
    itemPictureIdx: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    url: DataTypes.STRING,
    fk_itemIdx: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  return itemPictures;
};