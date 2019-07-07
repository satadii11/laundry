const baseRoute = require('./base_route');
const baseController = require('../controllers/base_controller');
const kategoriController = require('../controllers/kategori_controller');

const router = baseRoute();

router.get('/', baseController(req => kategoriController.getAllKategori(req.query.page, req.query.size, req.query.filter)));
router.get('/:id', baseController(req => kategoriController.getKategori(req.params.id)));
router.post('/', baseController(req => kategoriController.addNewKategori(req.body)));
router.put('/:id', baseController(req => kategoriController.editKategori(req.params.id, req.body)));
router.delete('/:id', baseController(req => kategoriController.deleteKategori(req.params.id)));

module.exports = router;
