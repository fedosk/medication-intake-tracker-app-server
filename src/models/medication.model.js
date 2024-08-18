const pool = require('../../db');

const createMedicationsTable = async () => {
  const createMedicationsTableQuery = `
        CREATE TABLE IF NOT EXISTS medications (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(100),
            description TEXT,
            initial_count INT DEFAULT 0,
            current_count INT DEFAULT 0,
            destination_count INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT NULL,
            is_active BOOLEAN DEFAULT true,
            CONSTRAINT fk_user
              FOREIGN KEY(user_id) 
              REFERENCES users(id)
              ON DELETE CASCADE
        );
    `;

  try {
    await pool.query(createMedicationsTableQuery);
  } catch (error) {
    console.error('Failed to create table: ', error);
  }
};

module.exports = createMedicationsTable;
