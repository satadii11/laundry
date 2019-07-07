const HttpStatus = require('http-status-codes');
const chai = require('chai');
const moment = require('moment');

chai.should();

const karyawanController = require('../controllers/karyawan_controller.js');

const datetime = moment().format('hmmss');
describe('Test karyawan controller', () => {
    it('should success get without parameter and contain totalPage', async () => {
        const res = await karyawanController.getAllKaryawan();
        res.status.should.equal(HttpStatus.OK);
        res.totalPage.should.be.a('number');
    });

    it('should success get with parameters and contain totalPage', async () => {
        const res = await karyawanController.getAllKaryawan(1, 15);
        res.status.should.equal(HttpStatus.OK);
        res.totalPage.should.be.a('number');
    });

    it('should success adding a new data karyawan', async () => {
        const res = await karyawanController.addNewKaryawan({
            username: 'karyawan' + datetime,
            password: 'karyawan',
            nama: 'Karyawan ' + datetime,
            no_hp: '0812981' + datetime
        });
        res.status.should.equal(HttpStatus.CREATED);
        res.data.tipe.should.equal('Petugas');
    });

    it('should success updating data', async () => {
        const res = await karyawanController.editKaryawan('karyawan' + datetime, {
            username: 'karyawan' + datetime,
            password: 'karyawan',
            nama: 'Karyawan ' + datetime,
            no_hp: '0812981' + datetime
        });
        res.status.should.equal(HttpStatus.OK);
    });

    it('should success deleting data', async () => {
        const res = await karyawanController.deleteKaryawan('karyawan' + datetime);
        res.status.should.equal(HttpStatus.OK);
    })
});