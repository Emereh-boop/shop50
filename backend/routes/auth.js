const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../server');
require('dotenv').config();

// User registration
router.post('/register', async (req, res) => {
    console.log('1. Auth: Starting registration process');
    console.log('2. Auth: Request body:', req.body);
    
    try {
        const { email, password, name } = req.body;
        
        // Validate required fields
        if (!email || !password || !name) {
            console.log('3. Auth: Registration failed - Missing required fields');
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['email', 'password', 'name']
            });
        }
        console.log('4. Auth: Required fields validation passed');

        // Get users from database
        console.log('5. Auth: Attempting to get users from database');
        let users = [];
        try {
            users = await db.getData('/users');
            console.log('6. Auth: Successfully retrieved users from database');
        } catch (error) {
            console.log('7. Auth: Error getting users, initializing as empty array');
            users = [];
        }

        // Check if user already exists
        console.log('8. Auth: Checking if user already exists');
        if (users.some(user => user.email === email)) {
            console.log('9. Auth: Registration failed - Email already exists');
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.log('10. Auth: Email is unique');

        // Hash password
        console.log('11. Auth: Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('12. Auth: Password hashed successfully');

        // Create new user
        console.log('13. Auth: Creating new user object');
        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        console.log('14. Auth: New user object created:', { ...newUser, password: '[REDACTED]' });

        // Add user to database
        console.log('15. Auth: Adding user to database');
        users.push(newUser);
        await db.push('/users', users);
        console.log('16. Auth: User successfully added to database');

        // Generate JWT token
        console.log('17. Auth: Generating JWT token');
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        console.log('18. Auth: JWT token generated successfully');

        // Send response
        console.log('19. Auth: Sending successful registration response');
        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('20. Auth: Error during registration:', error);
        res.status(500).json({ 
            message: 'Error during registration',
            error: error.message
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    console.log('1. Auth: Starting login process');
    console.log('2. Auth: Request body:', req.body);
    
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            console.log('3. Auth: Login failed - Missing required fields');
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['email', 'password']
            });
        }
        console.log('4. Auth: Required fields validation passed');

        // Get users from database
        console.log('5. Auth: Attempting to get users from database');
        const users = await db.getData('/users');
        console.log('6. Auth: Successfully retrieved users from database');

        // Find user
        console.log('7. Auth: Looking for user with email:', email);
        const user = users.find(u => u.email === email);
        
        if (!user) {
            console.log('8. Auth: Login failed - User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('9. Auth: User found');

        // Verify password
        console.log('10. Auth: Verifying password');
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            console.log('11. Auth: Login failed - Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('12. Auth: Password verified successfully');

        // Generate JWT token
        console.log('13. Auth: Generating JWT token');
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        console.log('14. Auth: JWT token generated successfully');

        // Send response
        console.log('15. Auth: Sending successful login response');
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('16. Auth: Error during login:', error);
        res.status(500).json({ 
            message: 'Error during login',
            error: error.message
        });
    }
});

module.exports = router; 