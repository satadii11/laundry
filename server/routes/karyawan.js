const baseRoute = require('./base_route');
const baseController = require('../controllers/base_controller');
const karyawanController = require('../controllers/karyawan_controller');
const adminOnly = require('../middlewares/admin_only');

const router = baseRoute();

router.put('/admin', adminOnly, baseController(req => karyawanController.updateAdmin(req.body)));
router.get('/', adminOnly, baseController(req => karyawanController.getAllKaryawan(req.query.page, req.query.size, req.query.filter)));
router.get('/:id', adminOnly, baseController(req => karyawanController.getKaryawan(req.params.id)));
router.post('/', adminOnly, baseController(req => karyawanController.addNewKaryawan(req.body)));
router.put('/:id', adminOnly, baseController(req => karyawanController.editKaryawan(req.params.id, req.body)));
router.delete('/:username', adminOnly, baseController(req => karyawanController.deleteKaryawan(req.params.username)));

module.exports = router;
