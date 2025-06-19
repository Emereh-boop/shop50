const express = require('express');
const router = express.Router();
const multer = require('multer');
const { db } = require('../server');
const path = require('path');
const fs = require('fs');

console.log('1. Products Route: Initializing products route');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('2. Products Route: Creating uploads directory');
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('3. Products Route: Multer destination:', uploadsDir);
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = uniqueSuffix + ext;
        console.log('4. Products Route: Generated filename:', filename);
        cb(null, filename);
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
    }
});

// Test route
router.get('/test', (req, res) => {
    console.log('5. Products Route: Test route hit');
    res.json({ message: 'Products route is working' });
});

// Health check route
router.get('/health', (req, res) => {
    console.log('5.1. Products Route: Health check route hit');
    res.json({ status: 'ok', message: 'Products service is healthy' });
});

// Get all products
router.get('/', async (req, res) => {
    console.log('6. Products Route: GET / - Fetching all products');
    try {
        console.log('7. Products Route: Attempting to get products from database');
        const products = await db.getData('/products');
        console.log('8. Products Route: Successfully retrieved products:', products);
        res.json(products);
    } catch (error) {
        console.error('9. Products Route: Error fetching products:', error);
        res.status(500).json({ 
            message: 'Error fetching products',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    console.log('10. Products Route: GET /:id - Fetching product with ID:', req.params.id);
    try {
        const products = await db.getData('/products');
        const product = products.find(p => p.id === req.params.id);
        
        if (!product) {
            console.log('11. Products Route: Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log('12. Products Route: Product found:', product);
        res.json(product);
    } catch (error) {
        console.error('13. Products Route: Error fetching product:', error);
        res.status(500).json({ 
            message: 'Error fetching product',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Create product
router.post('/', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'additionalImages', maxCount: 5 }]), async (req, res) => {
    console.log('1. Backend: Received POST request to /api/products');
    console.log('2. Backend: Request body:', req.body);
    console.log('3. Backend: Request files:', req.files);
    
    try {
        const { name, description, shortDescription, price, category, stock, brand, sizes, colors, tags, trending, onSale, discount, relatedProducts } = req.body;
        console.log('4. Backend: Destructured request body');
        
        // Validate required fields
        if (!name || !description || !price || !category || !stock || !brand) {
            console.log('5. Backend: Validation failed - missing required fields');
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['name', 'description', 'price', 'category', 'stock', 'brand']
            });
        }
        console.log('6. Backend: Validation passed');

        console.log('7. Backend: Attempting to get products from database');
        let products = [];
        try {
            products = await db.getData('/products');
            if (!Array.isArray(products)) {
                console.log('7.1. Backend: Products is not an array, initializing as empty array');
                products = [];
            }
        } catch (error) {
            console.log('7.2. Backend: Error getting products, initializing as empty array');
            products = [];
        }
        console.log('8. Backend: Successfully retrieved products from database');

        // Handle file uploads
        let mainImagePath = null;
        let additionalImagePaths = [];

        if (req.files) {
            if (req.files.mainImage && req.files.mainImage[0]) {
                mainImagePath = `/uploads/${req.files.mainImage[0].filename}`;
            }
            if (req.files.additionalImages) {
                additionalImagePaths = req.files.additionalImages.map(file => `/uploads/${file.filename}`);
            }
        }

        console.log('9. Backend: Creating new product object');
        const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            shortDescription,
            price: parseFloat(price),
            category,
            stock: parseInt(stock),
            brand,
            sizes: sizes ? sizes.split(',').map(size => size.trim()) : [],
            colors: colors ? colors.split(',').map(color => color.trim()) : [],
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            trending: trending === 'true',
            onSale: onSale === 'true',
            discount: onSale === 'true' ? parseInt(discount) : 0,
            relatedProducts: relatedProducts ? JSON.parse(relatedProducts) : [],
            mainImage: mainImagePath,
            additionalImages: additionalImagePaths,
            createdAt: new Date().toISOString()
        };
        console.log('10. Backend: New product object created:', newProduct);

        console.log('11. Backend: Adding new product to products array');
        products.push(newProduct);
        
        console.log('12. Backend: Saving to database');
        await db.push('/products', products);
        console.log('13. Backend: Successfully saved to database');
        
        console.log('14. Backend: Sending response');
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('15. Backend: Error occurred:', error);
        res.status(500).json({ 
            message: 'Error creating product',
            error: error.message 
        });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        
        const products = await db.getData('/products');
        const productIndex = products.findIndex(p => p.id === req.params.id);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products[productIndex] = {
            ...products[productIndex],
            name,
            description,
            price,
            image,
            category,
            updatedAt: new Date().toISOString()
        };

        await db.push('/products', products);
        res.json(products[productIndex]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: 'Error updating product',
            error: error.message 
        });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const products = await db.getData('/products');
        const productIndex = products.findIndex(p => p.id === req.params.id);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products.splice(productIndex, 1);
        await db.push('/products', products);
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            message: 'Error deleting product',
            error: error.message 
        });
    }
});

module.exports = router; 