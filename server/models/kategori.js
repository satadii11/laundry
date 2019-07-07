const Sequelize = require('sequelize');

const mysql = require('../services/mysql');

const kategoriScheme = {
  id_kategori: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nama_kategori: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  harga_kategori: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};

const Kategori = mysql.define('kategori', kategoriScheme, {
  tableName: 'kategori',
  timestamps: false
});

module.exports = Kategori;
