import React, { useState } from 'react';
import { ProductCard } from '@/components/common/ProductCard'; // Corrected import path
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore'; // Import useCartStore
import type { Product } from '@/types';

// Mock data if backend connection fails or for initial design
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport",
        price: 599,
        old_price: 699,
        img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        category: "Electronics",
        description: "Latest Apple Watch with health tracking.",
        sku: "AW7-001",
        stock: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 2,
        name: "iPhone 13 Pro Max - Sierra Blue",
        price: 1099,
        old_price: 1199,
        img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        category: "Electronics",
        description: "The biggest upgrade to the Pro camera system.",
        sku: "IP13-MAX-002",
        stock: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 3,
        name: "MacBook Pro 14-inch M1 Pro",
        price: 1999,
        old_price: undefined,
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        category: "Computers",
        description: "Supercharged for pros.",
        sku: "MBP14-003",
        stock: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 4,
        name: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        price: 348,
        old_price: 399,
        img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        category: "Audio",
        description: "Industry-leading noise cancellation.",
        sku: "SONY-XM4-004",
        stock: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const LandingPage: React.FC = () => {
    // In a real app, I would fetch from /api/products here
    const [products] = useState(MOCK_PRODUCTS);
    const addItem = useCartStore((state) => state.addItem); // Get addItem from store

    const handleAddToCart = (product: Product) => { // Define handleAddToCart
        addItem(product, 1);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-[#1e293b] py-20">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 text-white mb-10 md:mb-0">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Find Your Next <br /> <span className="text-blue-500">Favorite Tech</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-md">
                            Discover the latest gadgets and accessories at unbeatable prices.
                            Shop now and upgrade your lifestyle.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                            Shop Now
                        </Button>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        {/* Placeholder for Hero Image */}
                        <div className="relative w-full max-w-lg aspect-auto">
                            {/* Decorative elements */}
                            <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                            <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                            <img
                                src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Hero Devices"
                                className="relative z-10 rounded-2xl shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features / Benefits (Optional) */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">New Arrivals</h2>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={() => handleAddToCart(product)} // Pass the product to handleAddToCart
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
