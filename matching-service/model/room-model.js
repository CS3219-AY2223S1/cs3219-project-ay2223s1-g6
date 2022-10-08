import { db } from './database.js';
import { Sequelize } from 'sequelize';

export const Room = db.define('Room', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    difficultyLevel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);
