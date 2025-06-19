const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../server');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload single file
router.post('/uploads', upload.single('file'), async (req, res) => {
    try {
        console.log('Admin: File upload request received');
        
        if (!req.file) {
            console.log('Admin: No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Admin: File uploaded successfully:', req.file);
        
        // Return the file path relative to the uploads directory
        const filePath = `/uploads/${req.file.filename}`;
        
        res.status(201).json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                path: filePath,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Admin: Error uploading file:', error);
        res.status(500).json({ 
            message: 'Error uploading file',
            error: error.message 
        });
    }
});

// Upload multiple files
router.post('/uploads/multiple', upload.array('files', 5), async (req, res) => {
    try {
        console.log('Admin: Multiple files upload request received');
        
        if (!req.files || req.files.length === 0) {
            console.log('Admin: No files uploaded');
            return res.status(400).json({ message: 'No files uploaded' });
        }

        console.log('Admin: Files uploaded successfully:', req.files);
        
        // Return the file paths relative to the uploads directory
        const files = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype
        }));
        
        res.status(201).json({
            message: 'Files uploaded successfully',
            files
        });
    } catch (error) {
        console.error('Admin: Error uploading files:', error);
        res.status(500).json({ 
            message: 'Error uploading files',
            error: error.message 
        });
    }
});

// Get all uploaded files
router.get('/uploads', async (req, res) => {
    try {
        console.log('Admin: Fetching uploaded files');
        const uploadDir = path.join(__dirname, '..', 'uploads');
        
        if (!fs.existsSync(uploadDir)) {
            console.log('Admin: Uploads directory does not exist');
            return res.json({ files: [] });
        }

        const files = fs.readdirSync(uploadDir).map(filename => {
            const filePath = path.join(uploadDir, filename);
            const stats = fs.statSync(filePath);
            return {
                filename,
                path: `/uploads/${filename}`,
                size: stats.size,
                created: stats.birthtime
            };
        });

        console.log('Admin: Successfully retrieved uploaded files');
        res.json({ files });
    } catch (error) {
        console.error('Admin: Error fetching uploaded files:', error);
        res.status(500).json({ 
            message: 'Error fetching uploaded files',
            error: error.message 
        });
    }
});

// Delete uploaded file
router.delete('/uploads/:filename', async (req, res) => {
    try {
        console.log('Admin: Deleting file:', req.params.filename);
        const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
        
        if (!fs.existsSync(filePath)) {
            console.log('Admin: File not found');
            return res.status(404).json({ message: 'File not found' });
        }

        fs.unlinkSync(filePath);
        console.log('Admin: File deleted successfully');
        
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Admin: Error deleting file:', error);
        res.status(500).json({ 
            message: 'Error deleting file',
            error: error.message 
        });
    }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', email);
    
    const users = await db.getData('/users');
    const user = users.find(u => u.email === email && u.role === 'admin');
    
    if (!user) {
      console.log('Admin login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Admin login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Admin login successful:', email);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Admin registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Admin registration attempt:', email);
    
    const users = await db.getData('/users');
    
    if (users.some(u => u.email === email)) {
      console.log('Admin registration failed: Email already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await db.push('/users', users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Admin registration successful:', email);
    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        name: newUser.name 
      }
    });
  } catch (error) {
    console.error('Error in admin registration:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    console.log('Admin: Fetching all products');
    const products = await db.getData('/products');
    console.log('Admin: Successfully retrieved products');
    res.json(products);
  } catch (error) {
    console.error('Admin: Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get all users (admin)
router.get('/users', async (req, res) => {
  try {
    console.log('Admin: Fetching all users');
    const users = await db.getData('/users');
    // Remove sensitive information before sending
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }));
    console.log('Admin: Successfully retrieved users');
    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Admin: Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID (admin)
router.get('/users/:id', async (req, res) => {
  try {
    console.log('Admin: Fetching user with ID:', req.params.id);
    const users = await db.getData('/users');
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      console.log('Admin: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive information
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    };

    console.log('Admin: Successfully retrieved user');
    res.json(sanitizedUser);
  } catch (error) {
    console.error('Admin: Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user (admin)
router.put('/users/:id', async (req, res) => {
  try {
    console.log('Admin: Updating user with ID:', req.params.id);
    const { name, email, role } = req.body;
    
    const users = await db.getData('/users');
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      console.log('Admin: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role,
      updatedAt: new Date().toISOString()
    };

    await db.push('/users', users);
    console.log('Admin: Successfully updated user');

    // Remove sensitive information before sending response
    const sanitizedUser = {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      role: users[userIndex].role,
      updatedAt: users[userIndex].updatedAt
    };

    res.json(sanitizedUser);
  } catch (error) {
    console.error('Admin: Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (admin)
router.delete('/users/:id', async (req, res) => {
  try {
    console.log('Admin: Deleting user with ID:', req.params.id);
    const users = await db.getData('/users');
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      console.log('Admin: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    users.splice(userIndex, 1);
    await db.push('/users', users);
    console.log('Admin: Successfully deleted user');
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin: Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    console.log('Admin: Fetching all orders');
    const orders = await db.getData('/orders');
    console.log('Admin: Successfully retrieved orders');
    res.json(orders);
  } catch (error) {
    console.error('Admin: Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get order by ID (admin)
router.get('/orders/:id', async (req, res) => {
  try {
    console.log('Admin: Fetching order with ID:', req.params.id);
    const orders = await db.getData('/orders');
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      console.log('Admin: Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Admin: Successfully retrieved order');
    res.json(order);
  } catch (error) {
    console.error('Admin: Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Update order status (admin)
router.put('/orders/:id/status', async (req, res) => {
  try {
    console.log('Admin: Updating order status for ID:', req.params.id);
    const { status } = req.body;
    
    if (!status) {
      console.log('Admin: Status is required');
      return res.status(400).json({ message: 'Status is required' });
    }

    const orders = await db.getData('/orders');
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      console.log('Admin: Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    await db.push('/orders', orders);
    console.log('Admin: Successfully updated order status');
    
    res.json(orders[orderIndex]);
  } catch (error) {
    console.error('Admin: Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router; 