import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('test-db', 'user', 'password', {
  dialect: 'sqlite',
  host: './dev.sqlite', // data are stored in the file
});

const connection = async () => {
  sequelize.sync().then(() => {
    console.log('Connected to DB');
  });
};

export default { connection };
