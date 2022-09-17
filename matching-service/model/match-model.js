import { db } from './database.js';
import { Sequelize } from 'sequelize';

const easyLevel = db.define('Easy', {
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
    userId: {
        type: Sequelize.STRING,
        allowNull: false, // TODO: needed?
        primaryKey: true,
    },
        username: {
            type: Sequelize.STRING,
            allowNull: false, // TODO: needed?
        },
        difficultyLevel: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    },
);

const mediumLevel =  db.define('Medium', {
    userId: {
        type: Sequelize.STRING,
        allowNull: false, // TODO: needed?
        primaryKey: true,
    },

    username: {
            type: Sequelize.STRING,
            allowNull: false, // TODO: needed?
        },
        difficultyLevel: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    }
);

const hardLevel =  db.define('Hard', {
    userId: {
        type: Sequelize.STRING,
        allowNull: false, // TODO: needed?
        primaryKey: true,
    },

    username: {
            type: Sequelize.STRING,
            allowNull: false, // TODO: needed?
        },
        difficultyLevel: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    }
);

export default {easyLevel, mediumLevel, hardLevel};