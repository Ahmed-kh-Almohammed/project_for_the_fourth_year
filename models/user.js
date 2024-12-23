
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Archives', 'root', '', {
    host: 'localhost',
  dialect: 'mysql'
  });
const user = sequelize.define('user', {
  userId: {
    type: DataTypes.INTEGER
  },
  userName: {
    type: DataTypes.STRING
  }
  ,sessionFk:{
    type:DataTypes.INTEGER
  }
}, {
  tableName:'users'
});

module.exports=user;
