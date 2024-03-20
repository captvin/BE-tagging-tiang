const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ramonbot_checklist_regel_r5', {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
      comment: "id of regel"
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
    evidence_regel: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    pole_id_1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pole_id_2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    distance: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    qty_regel_point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "how many point of regel in one cable between poles"
    }
  }, {
    sequelize,
    tableName: 'ramonbot_checklist_regel_r5',
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
