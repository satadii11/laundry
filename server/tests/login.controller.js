const HttpStatus = require('http-status-codes');
const chai = require('chai');

chai.should();

const loginController = require('../controllers/login_controller');

describe('Test login controller', async () => {
    it('should fail because cannot find user', async () => {
        const username = 'usernamesalah';
        const password = 'admin';

        try {
            await loginController.login(username, password);
        } catch (err) {
            err.status.should.equal(HttpStatus.NOT_FOUND);
        }
    });

    it('should fail because password doesn\'t match', async () => {
        const username = "admin";
        const password = "passwordsalah";

        try {
            await loginController.login(username, password);
        } catch (err) {
            err.status.should.equal(HttpStatus.UNAUTHORIZED);
        }
    });

    it('should success event if password is not hashed', async () => {
        const username = 'passwordunhashed';
        const password = 'passwordunhashed';

        const res = await loginController.login(username, password);
        res.status.should.equal(HttpStatus.OK);
    });

    it('should success event if password is hashed', async () => {
        const username = 'admin';
        const password = 'admin123';

        const res = await loginController.login(username, password);
        res.status.should.equal(HttpStatus.OK);
    });
});