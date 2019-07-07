const baseRoute = require('./base_route');
const baseController = require('../controllers/base_controller');
const pelangganController = require('../controllers/pelanggan_controller');

const router = baseRoute();

router.get('/', baseController(req => pelangganController.getAllPelanggan(req.query.page, req.query.size, req.query.filter)));
router.get('/:id', baseController(req => pelangganController.getPelanggan(req.params.id)));
router.post('/', baseController(req => pelangganController.addNewPelanggan(req.body)));
router.put('/:id', baseController(req => pelangganController.editPelanggan(req.params.id, req.body)));
router.delete('/:id', baseController(req => pelangganController.deletePelanggan(req.params.id)));

module.exports = router;
