require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    console.log("🚀 ~ verifyToken ~ token:", token)

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    };

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.log("🚀 ~ verifyToken error:", error)
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;