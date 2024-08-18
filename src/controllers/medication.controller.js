const db = require('../../db');

class MedicationController {
    async createMedication(req, res) {
        console.log("🚀 ~ MedicationController ~ createMedication ~ req:", req.user)
        const { name, description, initialCount, currentCount, destinationCount } = req.body;

        try {
            const newMedication = await db.query(`INSERT INTO medications 
                                                (name, description, initial_count, current_count, destination_count)
                                                values ($1, $2, $3, $4, $5) RETURNING *`,
                                                [name, description, initialCount, currentCount, destinationCount]);
                                            
            res.json(newMedication.rows[0])
        } catch (error) {
            res.status(500).json({ error: error.message });
        };
    };

    // async updateMedication(req, res) {
    //     const { username, password } = req.body;

    //     try{
            
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // };
    // async getMedication(req, res) {
    //     const { username, password } = req.body;

    //     try{

    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // };
    // async getMedicationsList(req, res) {
    //     const { username, password } = req.body;

    //     try{

    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // };
    // async deleteMedication(req, res) {
    //     const { username, password } = req.body;

    //     try{

    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // };
};

module.exports = new MedicationController()

