const Router = require('express');
const router = new Router();
const userController = require('../controllers/user.controller');
const { body } = require('express-validator');

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 32 }),
  userController.registerUser,
);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/activate/:link', userController.activateUser);
router.get('/refresh', userController.refreshToken);
router.get('/users', userController.getUsers);

module.exports = router;
