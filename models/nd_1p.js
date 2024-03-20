const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nd_1p', {
    nd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sip: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'nd_1p',
    timestamps: false
  });
};
