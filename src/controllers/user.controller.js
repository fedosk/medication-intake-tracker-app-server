require('dotenv').config();
const userService = require('../service/user.service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api.exception');

class UserController {
  async registerUser(req, res, next) {
    const { username, email, password } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Validation error.', errors.array()));
      }

      const userData = await userService.registration(
        username,
        email,
        password,
      );

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 100,
        httpOnly: true,
      });

      return res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 100,
        httpOnly: true,
      });

      return res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }
  async activateUser(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    const { refreshToken } = req.cookies;

    try {
      const token = await userService.refresh(refreshToken);

      res.cookie('refreshToken', token, {
        maxAge: 30 * 24 * 60 * 100,
        httpOnly: true,
      });

      return res.status(201);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      console.log(req);
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req, res, next) {
    const { refreshToken } = req.cookies;

    try {
      const message = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');

      return res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
