const Router = require('express')
const router = new Router()
const medicationController = require('../controllers/medication.controller')

router.post('/medication', medicationController.createMedication);
// router.get('/user/:id', userController.getUser);
// router.get('/users', userController.getUsers);
// router.put('/user/:id', userController.updateUser);
// router.delete('/user/:id', userController.deleteUser);

module.exports = router