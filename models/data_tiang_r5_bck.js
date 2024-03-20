const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('data_tiang_r5_bck', {
    witel: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    sto: {
      type: DataTypes.STRING(10),
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
    longi: {
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
      type: DataTypes.STRING(50),
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
      type: DataTypes.BIGINT,
      allowNull: true
    },
    id: {
      type: DataTypes.STRING(100),
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
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "kolom tambahan untuk mencatat alamat lengkap tiang"
    }
  }, {
    sequelize,
    tableName: 'data_tiang_r5_bck',
    timestamps: true
  });
};
