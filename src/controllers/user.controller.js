require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const userService = require('../service/user.service');
const uuid = require('uuid');
const usernameHandler = require('../utils/usernameHandler');
const mailService = require('../service/mail.service');
const tokenService = require('../service/token.service');
const UserDto = require('../dtos/user.dto');




const SECRET_KEY = process.env.SECRET_KEY;

class UserController {
    async registerUser(req, res) {
        const { username, email, password } = req.body;
        try {
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const userData = await userService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 100, httpOnly: true });
            
            return res.status(201).json(userData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    async loginUser(req, res) {
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

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
                expiresIn: '24h',
            });

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    async activateUser(req, res) {
        try {
            const activationLink = req.params.link;
            console.log("🚀 ~ UserController ~ activateUser ~ activationLink:", activationLink)
            await userService.activate(activationLink);
            
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            console.log(error);
        };
    }
    async refreshToken(req, res) {
        try {
            
        } catch (error) {
            
        } 
    }
    async getUsers(req, res) {
        try {
            
        } catch (error) {
            
        } 
    }
    async logoutUser(req, res) {
        try {
            
        } catch (error) {
            
        }        
    };
};

module.exports = new UserController()

