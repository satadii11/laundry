const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

const Karyawan = require('../models/karyawan');
const ApiError = require('../helpers/ApiError');
const security = require('../helpers/security');

module.exports = {
  async login(username, password) {
    const karyawan = await Karyawan.findOne({ where: { username }});
    if (!karyawan) throw new ApiError('Karyawan tidak ditemukan', HttpStatus.NOT_FOUND);
    const isPasswordMatch = await security.compare(password, karyawan.password);
    if (!isPasswordMatch && password !== karyawan.password) throw new ApiError('Password yang dimasukkan salah', HttpStatus.UNAUTHORIZED);
    const token = jwt.sign({ username, password, type: karyawan.tipe }, process.env.SECRET_KEY);
    return {
      status: HttpStatus.OK,
      message: 'Berhasil melakukan login',
      data: karyawan,
      token: token
    };
  }
};
