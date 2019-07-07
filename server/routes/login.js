const baseRoute = require('./base_route');
const baseController = require('../controllers/base_controller');
const loginController = require('../controllers/login_controller');

const router = baseRoute();

router.post('/', baseController(req => loginController.login(req.body.username, req.body.password)));

module.exports = router;
