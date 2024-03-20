const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('linetiang', {
    id_line: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tiang: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'linetiang',
    timestamps: false
  });
};
