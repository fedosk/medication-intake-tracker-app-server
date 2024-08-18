const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');

router.post('/registration', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/activate/:link', userController.activateUser);
router.get('/refresh', userController.refreshToken);
router.get('/users', userController.getUsers);

module.exports = router;
