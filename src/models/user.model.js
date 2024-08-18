const pool = require('../../db');

const createUserTable = async () => {
  const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            activation_link VARCHAR(100) NOT NULL,
            is_activated BOOLEAN DEFAULT false,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await pool.query(createUserTableQuery);
  } catch (error) {
    console.error('Failed to create table: ', error);
  }
};

module.exports = createUserTable;
