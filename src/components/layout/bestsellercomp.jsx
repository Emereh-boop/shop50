import React, { useEffect, useState } from 'react';
import { useProducts } from '../../context/products/context'; // Assuming your context exists
import { filterMostPurchasedProducts } from '../../utils/filtermostpurchased';
import Product from '../products/product'; // Assuming you have a product component
import { useOrders } from '../../context/orders/context';
import { useAuth } from '../../context/auth/context';

const MostPurchased = () => {
    const { products = [] } = useProducts();
    const { orders = [] } = useOrders(); // Fetch orders from the orders collection
    const { user } = useAuth(); // Fetch user information from the auth context
    const [mostPurchased, setMostPurchased] = useState([]);

    useEffect(() => {
        const getMostPurchasedProducts = async () => {
            // Filter orders based on the userId from the order and the current user.uid
            const userOrders = orders.filter(order => order.userId === user?.uid);

            // Now filter products by purchase frequency based on the user's orders
            const filteredProducts = filterMostPurchasedProducts(userOrders, products);
            setMostPurchased(filteredProducts);
        };

        // Run the effect only if user and orders are available
        if (user && orders.length > 0) {
            getMostPurchasedProducts();
        }
    }, [products, orders, user]);

    if (mostPurchased.length === 0) {
        return
    }

    return (
        <div className="most-purchased-products">
            <h2 className="text-center text-4xl font-extrabold text-black mb-8">Most Purchased Products</h2>
            <div className="product-grid">
                {mostPurchased.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default MostPurchased;
