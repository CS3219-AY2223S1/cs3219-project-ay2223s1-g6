import { db } from './database.js';
import { Sequelize } from 'sequelize';

export const EasyPendingMatch = db.define('EasyPendingMatch', {
    // TODO: need to store socket id
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);

export const MediumPendingMatch = db.define('MediumPendingMatch', {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);

export const HardPendingMatch = db.define('HardPendingMatch', {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);
