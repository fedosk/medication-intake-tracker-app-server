require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../../db');
const uuid = require('uuid');
const usernameHandler = require('../utils/usernameHandler');
const mailService = require('../service/mail.service');
const tokenService = require('../service/token.service');
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/api.exception');

class UserService {
  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);

    if (!result.rows.length) {
      return null;
    }

    return result.rows[0];
  }

  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);

    if (!result.rows.length) {
      return null;
    }

    return result.rows[0];
  }

  async registration(username, email, password) {
    const isUserExist = await this.getUserByEmail(email);

    if (isUserExist) {
      throw ApiError.BadRequest('This user already exist.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4();
    const name = usernameHandler(username, email);

    const query = `INSERT INTO users (username, email, password, activation_link) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const value = [name, email, hashedPassword, activationLink];
    const result = await db.query(query, value);

    const userData = result.rows[0];
    const userId = result.rows[0].id;

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    const userDto = new UserDto(userData);
    const { accessToken, refreshToken } = tokenService.generateTokens({
      ...userDto,
    });
    await tokenService.storeRefreshToken(userId, refreshToken);

    return {refreshToken, accessToken, user: userDto };
  }

  async activate(activationLink) {
    const query = `SELECT * FROM users WHERE activation_link = $1;`;
    const value = [activationLink];
    const user = await db.query(query, value);

    if (!user.rows.length) {
      throw ApiError.BadRequest('Invalid activation link.');
    }

    const updateQuery = `UPDATE users SET is_activated = $1 WHERE id = $2;`;
    const updateValues = [true, user.rows[0].id];
    await db.query(updateQuery, updateValues);

    return { message: 'Account activated successfully' };
  }

  async login(email, password) {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const value = [email];
    const user = await db.query(query, value);

    if (!user.rows.length) {
      throw ApiError.BadRequest('User not found.');
    }

    const userData = user.rows[0];
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      throw ApiError.BadRequest('Invalid password.');
    }

    const userDto = new UserDto(userData);

    const { accessToken, refreshToken } = tokenService.generateTokens({
      ...userDto,
    });
    await tokenService.storeRefreshToken(userData.id, refreshToken);

    return { refreshToken, accessToken, user: userDto };
  }

  async logout(refreshToken) {
    const query = `SELECT * FROM tokens WHERE token = $1;`;
    const value = [refreshToken];
    const tokenData = await db.query(query, value);

    if (!tokenData.rows.length) {
      throw ApiError.BadRequest('User not found.');
    }

    const deleteQuery = `DELETE FROM tokens WHERE token = $1;`;
    await db.query(deleteQuery, value);

    return { message: 'Logged out successfully' };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizeError();
    }

    const userDataFromToken = tokenService.validateRefreshToken(refreshToken);
    const prevToken = tokenService.findToken(refreshToken);

    if (!userDataFromToken || !prevToken) {
      throw ApiError.UnauthorizeError();
    }

    const user = await this.getUserById(userDataFromToken.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.storeRefreshToken(user.id, tokens.refreshToken);

    return { accessToken: tokens.accessToken, user: userDto };
  }

  async getUsers() {
    const query = `SELECT * FROM users;`;
    const users = await db.query(query);

    return users.rows;
  }
}

module.exports = new UserService();
