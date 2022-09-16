import { db } from './database.js';
import { Sequelize } from 'sequelize';

export default db.define('PendingMatch', {
    // id: {
    //   filed: 'userid',
    //   type: Sequel.INTEGER,
    //   primaryKey: true,
    // },
    // startTime: {
    //   filed: 'starTime',
    //   type: Sequel.TIME,
    //   defaultValue: new Date(),
    // },
    // difficultyLevel: {
    //   filed: 'difficultyLevel',
    //   type: Sequel.STRING,
    // },
    username: {
      type: Sequelize.STRING,
      allowNull: false, // TODO: needed?
      primaryKey: true,
    },
    difficultyLevel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);
