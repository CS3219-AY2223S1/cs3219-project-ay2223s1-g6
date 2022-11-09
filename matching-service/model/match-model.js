import { Sequelize } from 'sequelize';
import { db } from './database.js';

export const EasyPendingMatch = db.define('EasyPendingMatch', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    socketId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);

export const MediumPendingMatch = db.define('MediumPendingMatch', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    socketId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);

export const HardPendingMatch = db.define('HardPendingMatch', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    socketId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);
