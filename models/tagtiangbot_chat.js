const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tagtiangbot_chat', {
    update_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    from_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    step: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    variable: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    progress: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tagtiangbot_chat',
    timestamps: false
  });
};
