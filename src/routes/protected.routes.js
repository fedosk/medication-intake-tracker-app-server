const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

router.get('/', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

module.exports = router;