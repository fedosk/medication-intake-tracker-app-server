require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool = require('../../db');

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
        const updateQuery = `UPDATE tokens SET token = $1, created_at = CURRENT_TIMESTAMP, expires_at = CURRENT_TIMESTAMP + interval '14 days' WHERE user_id = $2;`;
        const updateValues = [refreshToken, userId];
        await pool.query(updateQuery, updateValues);
      } else {
        const insertQuery = `INSERT INTO tokens (user_id, token, created_at, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '14 days') RETURNING *;`;
        const insertValues = [userId, refreshToken];
        await pool.query(insertQuery, insertValues);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new TokenService();
