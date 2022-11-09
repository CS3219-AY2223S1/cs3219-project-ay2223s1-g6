import { Sequelize } from 'sequelize';
import { db } from './database.js';

export const Room = db.define('Room', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    socketId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    difficultyLevel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    questionId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);
