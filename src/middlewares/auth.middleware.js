require('dotenv').config();
const ApiError = require('../exceptions/api.exception');
const tokenService = require('../service/token.service');

const verifyToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    const accessToken = bearerToken?.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizeError());
    }

    const userData = await tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizeError());
    }

    req.user = userData;
    next();
  } catch (error) {
    console.log('🚀 verifyToken error:', error);
    return next(ApiError.UnauthorizeError());
  }
};

module.exports = verifyToken;
