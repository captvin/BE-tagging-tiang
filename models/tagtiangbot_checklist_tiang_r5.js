const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tagtiangbot_checklist_tiang_r5', {
    witel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      primaryKey: true
    },
    nomor_tiang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lat_origin: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    longi_origin: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    from_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    evidence_pole: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    qty_ku_cable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    condition_odcb: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    condition_odp: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lat_tagging: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    longi_tagging: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    condition_alpro_competitor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    evidence_ku_dc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qty_dc_cable: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tagtiangbot_checklist_tiang_r5',
    timestamps: false
  });
};
