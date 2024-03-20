const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('linedata', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    witel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lineName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    start_lat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    start_lng: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    end_lat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    end_lng: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'linedata',
    timestamps: false
  });
};
