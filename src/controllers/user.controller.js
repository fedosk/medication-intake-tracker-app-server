require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const userService = require('../service/user.service');

const SECRET_KEY = process.env.SECRET_KEY;

class UserController {
    async registerUser(req, res, next) {
        const { username, email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const userData = await userService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 100, httpOnly: true });
            
            return res.status(201).json(userData);
        } catch (error) {
            next(error);
        }
    };

    async loginUser(req, res, next) {
        const { email, password } = req.body;

        try {
            const query = `SELECT id, username, password FROM users WHERE username = $1;`;
            const value = [email];
            const result = await pool.query(query, value);

            if (result.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid username or password' });
            }

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, {expiresIn: '24h'});

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    };
    async activateUser(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error);
        };
    }
    async refreshToken(req, res, next) {
        try {
            console.log(req);
        } catch (error) {
            next(error);
        } 
    }
    async getUsers(req, res, next) {
        try {
            console.log(req);
        } catch (error) {
            next(error);
        } 
    }
    async logoutUser(req, res, next) {
        try {
            console.log(req);
        } catch (error) {
            next(error);
        }        
    };
};

module.exports = new UserController()

