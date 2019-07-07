const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const moment = require('moment');

const Nota = require('../models/nota');
const Kategori = require('../models/kategori');
const Karyawan = require('../models/karyawan');
const Pelanggan = require('../models/pelanggan');
const ApiError = require('../helpers/ApiError');

moment.locale('id');

module.exports = {
  async getAllNota(page, size, filter) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    const where = {id_nota: {[Sequelize.Op.like]: `%${filter}%`}};
    const order = [['tanggal_keluar', 'ASC']]
    const nota = await Nota.findAll({ limit, offset, include: [Pelanggan, Karyawan, Kategori], where, order });
    if (!nota) throw new ApiError('Tidak ada data nota', HttpStatus.NOT_FOUND);
    const totalNota = await Nota.count();
    return {
      status: HttpStatus.OK,
      message: 'Berhasil mendapatkan data nota',
      data: nota,
      totalPage: Math.ceil(totalNota / limit)
    };
  },

  async getNota(id) {
    const nota = await Nota.findByPk(id);
    if (!nota) throw new ApiError(`Nota dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
    return {
      status: HttpStatus.OK,
      message: `Nota dengan id ${id} berhasil ditemukan`,
      data: nota
    };
  },

  async addNewNota(data) {
    const kategori = await Kategori.findByPk(data.id_kategori);
    const nota = await Nota.create({
      id_nota: data.id_nota,
      tanggal_masuk: moment().format('YYYY-MM-DD'),
      jml_pakaian: data.jml_pakaian,
      pelangganIdPelanggan: data.id_pelanggan,
      kategoriIdKategori: data.id_kategori,
      karyawanUsername: data.username,
      total_harga: data.total || (data.jml_pakaian * kategori.harga_kategori)
    });
    return {
      status: HttpStatus.CREATED,
      message: 'Berhasil menambahkan nota baru',
      data: nota
    };
  },

  async editNota(id, data) {
    const nota = await Nota.findByPk(id);
    if (!nota) throw new ApiError(`Nota dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
    const kategori = await Kategori.findByPk(data.id_kategori);
    await nota.update({
      jml_pakaian: data.jml_pakaian,
      pelangganIdPelanggan: data.id_pelanggan,
      kategoriIdKategori: data.id_kategori,
      karyawanUsername: data.username,
      total_harga: data.total || (data.jml_pakaian * kategori.harga_kategori)
    });
    return {
      status: HttpStatus.OK,
      message: `Berhasil melakukan perubahan data nota dengan id ${id}`,
      data: nota
    };
  },

  async deleteNota(id_nota) {
    await Nota.destroy({ where: { id_nota }});
    return {
      status: HttpStatus.OK,
      message: `Berhasil menghapus data nota dengan id ${id}`
    };
  },

  async takeNota(id) {
    const nota = await Nota.findByPk(id);
    if (!nota) throw new ApiError(`Nota dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
    await nota.update({ tanggal_keluar: moment().format('YYYY-MM-DD') });
    return {
      status: HttpStatus.OK,
      message: `Berhasil melakukan perubahan data nota dengan id ${id}`,
      data: nota
    };
  },

  async getIncomeReport(year) {
    let nota = await Nota.findAll({
      attributes: [
        [Sequelize.fn('month', Sequelize.col('tanggal_masuk')), 'bulan'],
        [Sequelize.fn('sum', Sequelize.col('total_harga')), 'jumlah']
      ],
      where: Sequelize.where(Sequelize.fn('year', Sequelize.col('tanggal_masuk')), year),
      group: ['bulan']
    });
    if (!nota) throw new ApiError('Tidak ada data nota', HttpStatus.NOT_FOUND);
    const result = [['Bulan', 'Pendapatan']];
    nota = JSON.parse(JSON.stringify(nota));
    nota.forEach(item => {
      result.push([
        moment(item.bulan, 'M').format('MMM'),
        parseInt(item.jumlah)
      ]);
    });
    return {
      status: HttpStatus.OK,
      message: 'Berhasil mendapatkan data nota',
      data: result
    };
  },

  async getOrderReport(year) {
    let nota = await Nota.findAll({
      attributes: [
        [Sequelize.fn('month', Sequelize.col('tanggal_masuk')), 'bulan'],
        [Sequelize.fn('count', Sequelize.col('*')), 'pemesanan']
      ],
      where: Sequelize.where(Sequelize.fn('year', Sequelize.col('tanggal_masuk')), year),
      group: ['bulan']
    });
    if (!nota) throw new ApiError('Tidak ada data nota', HttpStatus.NOT_FOUND);
    const result = [['Bulan', 'Pemesanan']];
    nota = JSON.parse(JSON.stringify(nota));
    nota.forEach(item => {
      result.push([
          moment(item.bulan, 'M').format('MMM'),
          item.pemesanan
      ]);
    });
    return {
      status: HttpStatus.OK,
      message: 'Berhasil mendapatkan data nota',
      data: result
    };
  },

  async getCategoryReport(year, month) {
    const bulan = moment(month, 'M').format('MM');
    let nota = await Nota.findAll({
      attributes: [[Sequelize.fn('count', Sequelize.col('*')), 'jumlah']],
      where: Sequelize.where(Sequelize.fn('date_format', Sequelize.col('tanggal_masuk'), '%Y-%m'), `${year}-${bulan}`),
      group: ['kategoriIdKategori'],
      include: [{
        model: Kategori,
        attributes: [['nama_kategori', 'nama']],
        required: true
      }]
    });
    if (!nota) throw new ApiError('Tidak ada data nota', HttpStatus.NOT_FOUND);
    const result = [['Bulan', 'Pemesanan']];
    nota = JSON.parse(JSON.stringify(nota));
    nota.forEach(item => {
      result.push([
        item.kategori.nama,
        item.jumlah
      ]);
    });
    return {
      status: HttpStatus.OK,
      message: 'Berhasil mendapatkan data nota',
      data: result
    };
  }
};
