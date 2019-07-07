const Sequelize = require('sequelize');

const mysql = require('../services/mysql');

const karyawanScheme = {
  username: {
    type: Sequelize.STRING(50),
    allowNull: false,
    primaryKey: true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  nama: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  no_hp: {
    type: Sequelize.STRING(14),
    allowNull: false
  },
  tipe: {
    type: Sequelize.ENUM('Admin', 'Petugas'),
    allowNull: false
  }
};

const Karyawan = mysql.define('karyawan', karyawanScheme, {
  tableName: 'karyawan',
  timestamps: false
});

module.exports = Karyawan;
