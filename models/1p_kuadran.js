const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('1p_kuadran', {
    notel: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: '1p_kuadran',
    timestamps: false
  });
};
