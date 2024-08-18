const pool = require('../../db');

const createTokenTable = async () => {
  const createTokenTableQuery = `
        CREATE TABLE IF NOT EXISTS tokens (
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            token TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            CONSTRAINT fk_user
              FOREIGN KEY(user_id) 
              REFERENCES users(id)
              ON DELETE CASCADE
        );
    `;

  try {
    await pool.query(createTokenTableQuery);
  } catch (error) {
    console.error('Failed to create table: ', error);
  }
};

module.exports = createTokenTable;
