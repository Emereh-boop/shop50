const express = require('express');
const cors = require('cors');
const { join } = require('path');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Validate environment variables
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1);
}

console.log('1. Server: Starting server initialization');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Database setup
console.log('2. Server: Setting up database');
const dbPath = join(__dirname, process.env.DB_PATH || 'db.json');
console.log('3. Server: Database path:', dbPath);
const dbConfig = new Config(dbPath, true, true, '/');
const db = new JsonDB(dbConfig);

// Initialize database with default data
console.log('4. Server: Initializing database');
try {
  // Check if database is empty or doesn't exist
  if (!db.exists('/')) {
    console.log('5. Server: Creating initial database structure');
    db.push('/', {
      users: [],
      products: [],
      orders: []
    });
  } else {
    // Ensure all required arrays exist
    if (!db.exists('/users')) db.push('/users', []);
    if (!db.exists('/products')) db.push('/products', []);
    if (!db.exists('/orders')) db.push('/orders', []);
  }
  console.log('6. Server: Database initialized successfully');
} catch (error) {
  console.error('7. Server: Error initializing database:', error);
  // If there's an error, try to create a fresh database
  db.push('/', {
    users: [],
    products: [],
    orders: []
  });
}

// Export db instance
module.exports.db = db;

// Import routes after db initialization
console.log('8. Server: Importing routes');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await db.getData('/users');
    const user = users.find(u => u.email === email && u.role === 'admin');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

app.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const users = await db.getData('/users');
    
    if (users.some(u => u.email === email)) {
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
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token, 
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Error in admin registration:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('9. Server: Test route hit');
  res.json({ message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  console.log('10. Server: Health check');
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('11. Server: Error occurred:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`12. Server: Server running on port ${port}`);
}); 