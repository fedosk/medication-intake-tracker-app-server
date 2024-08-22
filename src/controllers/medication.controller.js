const medicationService = require('../service/medication.service');

class MedicationController {
  async createMedication(req, res, next) {
    const { name, description, initial_count, current_count, destination_count } =
    req.body;

    try {
      const medication = await medicationService.createMedication(
        name,
        description,
        initial_count,
        current_count,
        destination_count,
        req.user.id,
      );

      res.json(medication);
    } catch (error) {
      next(error);
    }
  }

  async getMedication(req, res, next) {
    const id = req.params.id;

    try {
      const medication = await medicationService.getMedication(id);
      res.json(medication);
    } catch (error) {
      next(error);
    }
  }

  async getUserMedicationsList(req, res, next) {
    try {
      const medicationList = await medicationService.getUserMedications(
        req.user.id,
      );
      res.json(medicationList);
    } catch (error) {
      next(error);
    }
  }

  async updateMedication(req, res, next) {
    const id = req.params.id;
  
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
  
    const updates = req.body;
  
    try {
      const updatedMedication = await medicationService.updateMedication(id, updates);

      if (!updatedMedication) {
        return res.status(404).json({ error: 'Medication not found' });
      }
  
      res.status(200).json(updatedMedication);
    } catch (error) {
      next(error);
    }
  }

  async deleteMedication(req, res, next) {
    const id = req.params.id
  
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
      const deletedMedication = await medicationService.deleteMedication(id);
      res.status(200).json(deletedMedication);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicationController();
