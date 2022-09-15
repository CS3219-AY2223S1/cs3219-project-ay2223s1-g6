import Sequel from 'sequelize';
import sequelizeDB from './../database/sequelize.js'

const questionDifficulty = sequelizeDB.sequelizeDB.define(
    'questionDifficulty',
    {
      id: {
        filed:'userid',
        type: Sequel.INTEGER,
        primaryKey: true
      },
      startTime: {
        filed: 'starTime',
        type: Sequel.TIME,
          defaultValue: new Date()
      },
      difficultyLevel: {
        filed: 'difficultyLevel',
        type: Sequel.STRING
      }
    }, {
        freezeTableName: true,
    }
)

const connection = async () => {
    sequelizeDB.sequelizeDB.authenticate().then(() => {
          console.log('Connected to Postgres DB')}).catch(error => console.log("Error:" + error));
  //   sequelizeDB.sequelizeDB.sync().then(() => {
  //   console.log('Connected to DB');
  // });
};

export default { connection, questionDifficulty };

// module.exports.questionDifficulty = questionDifficulty;