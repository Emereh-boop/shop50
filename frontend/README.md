# Adidas Clone Frontend

This is the frontend application for the Adidas clone project, built with Svelte and Tailwind CSS.

## Features

- Modern, responsive design following Adidas' design system
- Product browsing and filtering
- Shopping cart functionality
- User authentication
- Order management
- Dark mode support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── product/
│   │   └── ui/
│   ├── routes/
│   ├── stores/
│   ├── App.svelte
│   ├── main.js
│   └── app.css
├── public/
├── index.html
└── package.json
```

## Technologies Used

- Svelte
- Tailwind CSS
- Vite
- svelte-spa-router

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Frontend Documentation

## Product Schema

The product schema includes the following fields:

- **id**: Unique identifier for the product.
- **name**: Name of the product.
- **description**: Full description of the product.
- **shortDescription**: Short summary of the product.
- **price**: Price of the product.
- **category**: Category of the product.
- **stock**: Number of items in stock.
- **brand**: Brand name of the product.
- **sizes**: Array of available sizes.
- **colors**: Array of available colors.
- **tags**: Array of tags/keywords for the product.
- **trending**: Boolean indicating if the product is trending.
- **onSale**: Boolean indicating if the product is on sale.
- **discount**: Discount percentage if the product is on sale.
- **mainImage**: URL of the main product image.
- **additionalImages**: Array of URLs for additional product images.
- **relatedProducts**: Array of related product IDs.
- **createdAt**: Timestamp when the product was created.
- **updatedAt**: Timestamp when the product was last updated.

## API Endpoints

### Products

- **GET `/api/products`**: Fetches all products.
- **GET `/api/products/:id`**: Fetches a single product by ID.
- **POST `/api/products`**: Creates a new product. Requires a multipart form data with fields for product details and images.
- **PUT `/api/products/:id`**: Updates an existing product.
- **DELETE `/api/products/:id`**: Deletes a product.

### Authentication

- **POST `/api/auth/login`**: Logs in a user.
- **POST `/api/auth/register`**: Registers a new user.
- **POST `/api/auth/logout`**: Logs out a user.

### Orders

- **GET `/api/orders`**: Fetches all orders for the logged-in user.
- **POST `/api/orders`**: Creates a new order.

### Recommendations

- **GET `/api/recommendations`**: Fetches product recommendations for the logged-in user. 