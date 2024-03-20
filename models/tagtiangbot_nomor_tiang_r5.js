const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tagtiangbot_nomor_tiang_r5', {
    nomor_tiang: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tagtiangbot_nomor_tiang_r5',
    timestamps: false
  });
};
