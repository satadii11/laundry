const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');

const Kategori = require('../models/kategori');
const ApiError = require('../helpers/ApiError');

module.exports = {
  async getAllKategori(page, size, filter) {
    const limit = size || 10;
    const offset = (page - 1) * limit;
    const where = {nama_kategori: {[Sequelize.Op.like]: `%${filter}%`}}
    let kategori = null;
    if (page === '-1') kategori = await Kategori.findAll({where});
    else kategori = await Kategori.findAll({ limit, offset, where });
    if (!kategori) throw new ApiError('Tidak ada data kategori', HttpStatus.NOT_FOUND);
    const totalKategori = await Kategori.count({where});
    return {
      status: HttpStatus.OK,
      message: 'Berhasil mendapatkan data kategori',
      data: kategori,
      totalPage: Math.ceil(totalKategori / limit)
    };
  },

  async getKategori(id) {
    const kategori = await Kategori.findByPk(id);
    if (!kategori) throw new ApiError(`Kategori dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
    return {
      status: HttpStatus.OK,
      message: `Kategori dengan id ${id} berhasil ditemukan`,
      data: kategori
    };
  },

  async addNewKategori(data) {
    const kategori = await Kategori.create(data);
    return {
      status: HttpStatus.CREATED,
      message: 'Berhasil menambahkan kategori baru',
      data: kategori
    };
  },

  async editKategori(id, data) {
    const kategori = await Kategori.findByPk(id);
    if (!kategori) throw new ApiError(`Kategori dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
    await kategori.update(data);
    return {
      status: HttpStatus.OK,
      message: `Berhasil melakukan perubahan data kategori dengan id ${id}`,
      data: kategori
    };
  },

  async deleteKategori(id_kategori) {
    await Kategori.destroy({ where: { id_kategori }});
    return {
      status: HttpStatus.OK,
      message: `Berhasil menghapus data kategori dengan id ${id_kategori}`
    };
  }
}
