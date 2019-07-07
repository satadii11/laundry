const Sequelize = require('sequelize');
require('dotenv').config();

const mysql = new Sequelize(process.env.MYSQL, { dialect: 'mysql' });
mysql.sync({ force: false }).then(() => console.log(`Table has been created`));

module.exports = mysql;
