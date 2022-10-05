import { db } from './database.js';
import { Sequelize } from 'sequelize';

export const EasyPendingMatch = db.define('EasyPendingMatch', {
    username: {
      type: Sequelize.STRING,
      primaryKey: true,
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
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);
