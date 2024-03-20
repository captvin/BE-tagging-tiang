const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lineprovider', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_line: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_provider: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'lineprovider',
    timestamps: false
  });
};
