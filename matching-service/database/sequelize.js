import { Sequelize } from 'sequelize';

// const sequelizeDB = new Sequelize('test-db', 'user', 'password', {
//     dialect: 'sqlite',
//     host: './dev.sqlite', // data are stored in the file
// });

const sequelizeDB = new Sequelize('postgres', 'bytedance', 'CS3219Project', {
    host: 'localhost',
    dialect: 'postgres',
    port: '5433'
});

export default {sequelizeDB}