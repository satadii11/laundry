const Sequelize = require('sequelize');

const Pelanggan = require('./pelanggan');
const Kategori = require('./kategori');
const Karyawan = require('./karyawan');
const mysql = require('../services/mysql');

const notaScheme = {
  tanggal_masuk: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  tanggal_keluar: {
    type: Sequelize.DATEONLY
  },
  id_nota: {
    type: Sequelize.CHAR(12),
    allowNull: false,
    primaryKey: true
  },
  jml_pakaian: {
    type: Sequelize.DECIMAL(10,2),
    allowNull: false
  },
  total_harga: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};

const Nota = mysql.define('nota', notaScheme, {
  tableName: 'nota',
  timestamps: false
});

Nota.belongsTo(Pelanggan)
Nota.belongsTo(Kategori)
Nota.belongsTo(Karyawan)
Pelanggan.hasMany(Nota)
Kategori.hasMany(Nota)
Karyawan.hasMany(Nota)

module.exports = Nota;
