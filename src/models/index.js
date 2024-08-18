const pool = require('../../db');

const createTables = async () => {
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

  const createMedicationsTableQuery = `
        CREATE TABLE IF NOT EXISTS medications (
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            name VARCHAR(100),
            description TEXT,
            initial_count INT DEFAULT 0,
            current_count INT DEFAULT 0,
            destination_count INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT true,
            CONSTRAINT fk_user
              FOREIGN KEY(user_id) 
              REFERENCES users(id)
              ON DELETE CASCADE
        );
    `;

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
    await pool.query(createUserTableQuery);
    await pool.query(createMedicationsTableQuery);
    await pool.query(createTokenTableQuery);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Failed to create tables: ', error);
  }
};

module.exports = createTables;
