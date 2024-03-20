const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ramonbot_checklist_tiang_r5_old', {
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
      allowNull: false,
      primaryKey: true,
      comment: "id of pole"
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
      allowNull: false
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
      allowNull: true,
      comment: "lattide from tagging bot"
    },
    longi_tagging: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "longitude bot"
    }
  }, {
    sequelize,
    tableName: 'ramonbot_checklist_tiang_r5_old',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
