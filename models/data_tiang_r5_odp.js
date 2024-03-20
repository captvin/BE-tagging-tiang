const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('data_tiang_r5_odp', {
    witel: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    sto: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    nomor_tiang: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    long: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jenis_tiang: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    jenis_pekerjaan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    petugas_upload: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tiang_kita_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    designator: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telco_pole_tag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    construction_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lokasi: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    status_object: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    synced: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    odp_location: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'data_tiang_r5_odp',
    timestamps: true
  });
};
