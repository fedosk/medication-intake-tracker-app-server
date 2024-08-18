require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../../db');
const uuid = require('uuid');
const usernameHandler = require('../utils/usernameHandler');
const mailService = require('../service/mail.service');
const tokenService = require('../service/token.service');
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/api.exception')

class UserService {
  async getUserByEmail(email){    
    const query = 'SELECT id, username, created_at FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    };

    return result.rows[0]; 
  };

  async registration(username, email, password) {
    const isUserExist = await this.getUserByEmail(email);

    if (isUserExist) {  
      throw new ApiError.BadRequest("This user already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4();
    const name = usernameHandler(username, email);

    const query = `INSERT INTO users (username, email, password, activation_link) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const value = [name, email, hashedPassword, activationLink];
    const result = await pool.query(query, value);
    
    const userData = result.rows[0];
    const userId = result.rows[0].id;

    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(userData);
    const { accessToken, refreshToken } = tokenService.generateTokens({...userDto});
    await tokenService.storeRefreshToken(userId, refreshToken);

    return {accessToken, refreshToken, user: userDto};
  };

  async activate(activationLink) {
    const query = `SELECT * FROM users WHERE activation_link = $1;`;
    const value = [activationLink];
    const user = await pool.query(query, value);

    if (!user.rows.length) {
      throw new ApiError.BadRequest('Invalid activation link.');
    };

    const updateQuery = `UPDATE users SET is_activated = $1 WHERE id = $2;`;
    const updateValues = [true, user.rows[0].id];
    await pool.query(updateQuery, updateValues);

    // Optionally, return user info or success message.
    return { message: 'Account activated successfully' };
  };
};

module.exports = new UserService()