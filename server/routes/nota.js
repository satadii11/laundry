const baseRoute = require('./base_route');
const baseController = require('../controllers/base_controller');
const notaController = require('../controllers/nota_controller');

const router = baseRoute();

router.get('/', baseController(req => notaController.getAllNota(req.query.page, req.query.size, req.query.filter)));
router.get('/:id', baseController(req => notaController.getNota(req.params.id)));
router.post('/', baseController(req => notaController.addNewNota(req.body)));
router.put('/:id', baseController(req => notaController.editNota(req.params.id, req.body)));
router.delete('/:id', baseController(req => notaController.deleteNota(req.params.id)));
router.put('/taken/:id', baseController(req => notaController.takeNota(req.params.id)));

router.get('/report/income/:year', baseController(req => notaController.getIncomeReport(req.params.year)));
router.get('/report/order/:year', baseController(req => notaController.getOrderReport(req.params.year)));
router.get('/report/category/:year/:month', baseController(req =>
    notaController.getCategoryReport(req.params.year, req.params.month)));

module.exports = router;
