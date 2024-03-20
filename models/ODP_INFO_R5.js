const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ODP_INFO_R5', {
    WITEL: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    STO: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ODP_EID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ODP_ID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ODP_NAME: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    ODP_LOCATION: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    LATITUDE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LONGITUDE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ID_TIANG: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ODP_INFO_R5',
    timestamps: false
  });
};
