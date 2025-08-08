const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const code_repositories = sequelize.define(
    'code_repositories',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

client_folder: {
        type: DataTypes.TEXT,

      },

server_folder: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  code_repositories.associate = (db) => {

    db.code_repositories.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.code_repositories.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return code_repositories;
};

