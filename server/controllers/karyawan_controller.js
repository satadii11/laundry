const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');

const Karyawan = require('../models/karyawan');
const ApiError = require('../helpers/ApiError');
const security = require('../helpers/security');

module.exports = {
    async updateAdmin(data) {
        const karyawan = await Karyawan.findOne({where: {tipe: 'Admin'}});
        const password = await security.hashPassword(data.password);
        await karyawan.update({...data, password});
        return {
            status: HttpStatus.OK,
            message: `Berhasil melakukan perubahan data admin`,
            data: karyawan
        };
    },

    async getAllKaryawan(page, size, filter) {
        const limit = size || 10;
        const offset = page ? (page - 1) * limit : 0;
        const where = {nama: {[Sequelize.Op.like]: `%${filter}%`}, tipe: 'Petugas'}
        const karyawan = await Karyawan.findAll({limit, offset, where});
        if (!karyawan) throw new ApiError('Tidak ada data karyawan', HttpStatus.NOT_FOUND);
        const totalKaryawan = await Karyawan.count({where});
        return {
            status: HttpStatus.OK,
            message: 'Berhasil mendapatkan data karyawan',
            data: karyawan,
            totalPage: Math.ceil(totalKaryawan / limit)
        };
    },

    async getKaryawan(id) {
        const karyawan = await Karyawan.findByPk(id);
        if (!karyawan) throw new ApiError(`Karyawan dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
        return {
            status: HttpStatus.OK,
            message: `Karyawan dengan id ${id} berhasil ditemukan`,
            data: karyawan
        };
    },

    async addNewKaryawan(data) {
        const password = await security.hashPassword(data.password);
        const karyawan = await Karyawan.create({...data, password, tipe: 'Petugas'});
        return {
            status: HttpStatus.CREATED,
            message: 'Berhasil menambahkan karyawan baru',
            data: karyawan
        };
    },

    async editKaryawan(id, data) {
        const karyawan = await Karyawan.findByPk(id);
        if (!karyawan) throw new ApiError(`Karyawan dengan id ${id} tidak ditemukan`, HttpStatus.NOT_FOUND);
        const password = await security.hashPassword(data.password);
        await karyawan.update({...data, password});
        return {
            status: HttpStatus.OK,
            message: `Berhasil melakukan perubahan data karyawan dengan id ${id}`,
            data: karyawan
        };
    },

    async deleteKaryawan(username) {
        await Karyawan.destroy({where: {username}});
        return {
            status: HttpStatus.OK,
            message: `Berhasil menghapus data karyawan dengan username ${username}`
        };
    }
}