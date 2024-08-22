require('dotenv').config();
const db = require('../../db');
const ApiError = require('../exceptions/api.exception');

class MedicationService {
  async createMedication(
    name,
    description,
    initialCount,
    currentCount,
    destinationCount,
    userId,
  ) {
    const createMedicationQuery = `INSERT INTO medications (name, description, initial_count, current_count, destination_count, user_id) values ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const createMedicationValues = [
      name,
      description,
      initialCount,
      currentCount,
      destinationCount,
      userId,
    ];

    const newMedication = await db.query(
      createMedicationQuery,
      createMedicationValues,
    );

    return newMedication.rows[0];
  }

  async getMedication(id) {
    const getMedicationQuery = `SELECT * FROM medications WHERE id = $1`;
    const getMedicationValues = [id];

    const medication = await db.query(getMedicationQuery, getMedicationValues);

    if (!medication.rows.length) {
      throw ApiError.BadRequest('Medication not found.');
    }

    return medication.rows[0];
  }

  async getUserMedications(userId) {
    const getUserMedicationsQuery = `SELECT * FROM medications WHERE user_id = $1`;
    const getUserMedicationsValues = [userId];

    const medication = await db.query(
      getUserMedicationsQuery,
      getUserMedicationsValues,
    );

    if (!medication.rows.length) {
      return [];
    }

    return medication.rows;
  }

  async updateMedication(id, updates) {
    const updateFields = [];
    const updateValues = [];
    let fieldIndex = 1;

    for (let key in updates) {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = $${fieldIndex}`);
        updateValues.push(updates[key]);
        fieldIndex++;
      }
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (!updateFields.length) {
      throw ApiError.BadRequest('No fields to update.');
    }

    const updateQuery = `UPDATE medications SET ${updateFields.join(', ')} WHERE id = $${fieldIndex} RETURNING *`;
    updateValues.push(id);

    const result = await db.query(updateQuery, updateValues);
    return result.rows[0];
  }

  async deleteMedication(id) {
    const deleteQuery = `DELETE FROM medications WHERE id = $1 RETURNING *`;
    const deleteValues = [id];

    const result = await db.query(deleteQuery, deleteValues);

    if (!result.rows.length) {
      throw ApiError.BadRequest('Medication not found.');
    }

    return result.rows[0];
  }
}

module.exports = new MedicationService();
