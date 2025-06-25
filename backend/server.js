const express = require('express');
const cors = require('cors');
const { join } = require('path');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
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
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://www.youngntrendy.com'
    ];
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
app.use('/uploads', express.static(join(__dirname, 'routes', 'uploads')));

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

// Online Users Endpoints
app.post('/api/users/heartbeat', async (req, res) => {
  const { userId } = req.body;
  console.log('[HEARTBEAT] Received heartbeat for userId:', userId);
  if (!userId) return res.status(400).json({ message: 'Missing userId' });
  try {
    const users = await db.getData('/users');
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].lastActive = Date.now();
      await db.push('/users', users);
      console.log(`[HEARTBEAT] Updated lastActive for userId: ${userId}`);
    } else {
      console.log('[HEARTBEAT] User not found for userId:', userId);
      console.log('[HEARTBEAT] All user ids in db:', users.map(u => u.id));
    }
    res.json({ success: true });
  } catch (e) {
    console.error('[HEARTBEAT] Error updating lastActive:', e);
    res.status(500).json({ message: 'Error updating lastActive' });
  }
});

app.get('/api/users/online', async (req, res) => {
  try {
    const users = await db.getData('/users');
    const now = Date.now();
    const online = users.filter(u => u.lastActive && now - u.lastActive < 2 * 60 * 1000);
    res.json(online);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching online users' });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { cart, email, shippingInfo } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or invalid' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    // Calculate total amount in kobo
    const amount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100;
    // Initialize Paystack transaction
    const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: Math.round(amount),
      callback_url: `${process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5173/api/paystack/callback'}`
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || 'pk_live_ad421434f5eb300d0018953e620f9327120af0e2'}`,
        'Content-Type': 'application/json'
      }
    });
    const { authorization_url, reference } = paystackRes.data.data;
    // Optionally, store the reference and cart in a temp store/db for later verification
    res.status(200).json({ data: { authorization_url, reference } });
  } catch (error) {
    console.error('Paystack init error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initialize payment', error: error.response?.data || error.message });
  }
});

// Paystack callback endpoint
app.get('/api/paystack/callback', async (req, res) => {
  const { reference } = req.query;
  if (!reference) {
    return res.redirect('/checkout/error');
  }
  try {
    // Verify transaction
    const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    const data = verifyRes.data.data;
    if (data.status === 'success') {
      // Create order in DB (simplified, you may want to store more info)
      let orders = [];
      try {
        orders = await db.getData('/orders');
        if (!Array.isArray(orders)) orders = [];
      } catch (e) { orders = []; }
      const order = {
        id: Date.now().toString(),
        reference,
        email: data.customer.email,
        amount: data.amount / 100,
        status: 'paid',
        createdAt: new Date().toISOString()
      };
      orders.push(order);
      await db.push('/orders', orders);
      return res.redirect('/checkout/success');
    } else {
      return res.redirect('/checkout/error');
    }
  } catch (error) {
    console.error('Paystack verify error:', error.response?.data || error.message);
    return res.redirect('/checkout/error');
  }
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