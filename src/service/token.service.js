require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool = require('../../db');
const ApiError = require('../exceptions/api.exception');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '24h',
    });
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
      expiresIn: '14d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(userId, refreshToken) {
    try {
      const query = `SELECT * FROM tokens WHERE user_id = $1;`;
      const value = [userId];
      const tokenData = await pool.query(query, value);

      if (tokenData.rows.length > 0) {
        const updateQuery = `UPDATE tokens SET token = $2, created_at = CURRENT_TIMESTAMP, expires_at = CURRENT_TIMESTAMP + interval '14 days' WHERE user_id = $1;`;
        const updateValues = [userId, refreshToken];
        return await pool.query(updateQuery, updateValues);
      }

      const insertQuery = `INSERT INTO tokens (user_id, token, created_at, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '14 days') RETURNING *;`;
      const insertValues = [userId, refreshToken];
      await pool.query(insertQuery, insertValues);
    } catch (error) {
      throw ApiError.BadRequest(error);
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
      return userData;
    } catch (error) {
      console.log('🚀 validateRefreshToken error:', error);
      return null;
    }
  }

  async validateAccessToken(accessTokenToken) {
    try {
      const userData = jwt.verify(accessTokenToken, process.env.SECRET_KEY);
      return userData;
    } catch (error) {
      console.log('🚀 validateAccessToken error:', error);
      return null;
    }
  }

  async findToken(refreshToken) {
    const query = `SELECT * FROM tokens WHERE token = $1;`;
    const value = [refreshToken];
    const tokenData = await pool.query(query, value);

    return tokenData.rows[0];
  }
}

module.exports = new TokenService();
