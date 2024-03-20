const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tagtiangbot_checklist_tiang_r5_provider', {
    tagtiangbot_checklist_uuid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tagtiangbot_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    qty_cable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tagtiangbot_checklist_tiang_r5_provider',
    timestamps: false
  });
};
