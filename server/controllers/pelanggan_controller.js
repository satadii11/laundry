const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');

const Pelanggan = require('../models/pelanggan');
const ApiError = require('../helpers/ApiError');

module.exports = {
    async getAllPelanggan(page, size, filter) {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        const where = {nama_pelanggan: {[Sequelize.Op.like]: `%${filter}%`}}
        let pelanggan;
        if (page === '-1') pelanggan = await Pelanggan.findAll({where});
        else pelanggan = await Pelanggan.findAll({limit, offset, where});
        if (!pelanggan) throw new ApiError('Tidak ada data pelanggan', HttpStatus.NOT_FOUND);
        const totalPelanggan = await Pelanggan.count({where});
        return {
            status: HttpStatus.OK,
            message: 'Berhasil mendapatkan data pelanggan',
            data: pelanggan,
            totalPage: Math.ceil(totalPelanggan / limit)
        };
    },

    async getPelanggan(id) {
        const pelanggan = await Pelanggan.findByPk(id);
        if (!pelanggan) throw new ApiError(`Pelanggan dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
        return {
            status: HttpStatus.OK,
            message: `Pelanggan dengan id ${id} berhasil ditemukan`,
            data: pelanggan
        };
    },

    async addNewPelanggan(data) {
        const pelanggan = await Pelanggan.create(data);
        return {
            status: HttpStatus.CREATED,
            message: 'Berhasil menambahkan pelanggan baru',
            data: pelanggan
        };
    },

    async editPelanggan(id, data) {
        const pelanggan = await Pelanggan.findByPk(id);
        if (!pelanggan) throw new ApiError(`Pelanggan dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
        await pelanggan.update(data);
        return {
            status: HttpStatus.OK,
            message: `Berhasil melakukan perubahan data pelanggan dengan id ${id}`,
            data: pelanggan
        };
    },

    async deletePelanggan(id_pelanggan) {
        await Pelanggan.destroy({where: {id_pelanggan}});
        return {
            status: HttpStatus.OK,
            message: `Berhasil menghapus data pelanggan dengan id ${id_pelanggan}`
        };
    }
}