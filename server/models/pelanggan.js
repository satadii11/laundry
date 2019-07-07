const Sequelize = require('sequelize');

const mysql = require('../services/mysql');

const pelangganScheme = {
  id_pelanggan: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nama_pelanggan: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  no_hp: {
    type: Sequelize.STRING(14),
    allowNull: false
  }
};

const Pelanggan = mysql.define('pelanggan', pelangganScheme, {
  tableName: 'pelanggan',
  timestamps: false
});

module.exports = Pelanggan;
