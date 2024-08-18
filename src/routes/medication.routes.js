const Router = require('express');
const router = new Router();
const medicationController = require('../controllers/medication.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/medication',
  authMiddleware,
  medicationController.createMedication,
);
router.get(
  '/medication/:id',
  authMiddleware,
  medicationController.getMedication,
);
router.get(
  '/medications',
  authMiddleware,
  medicationController.getUserMedicationsList,
);
router.put(
  '/medication/:id',
  authMiddleware,
  medicationController.updateMedication,
);
router.delete(
  '/medication/:id',
  authMiddleware,
  medicationController.deleteMedication,
);

module.exports = router;
