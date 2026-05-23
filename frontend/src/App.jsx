import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import { ShoppingBag, X, Plus, Minus, CheckCircle } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Home Jersey', price: 75, category: 'jerseys', gender: 'unisex' },
  { id: '2', name: 'Pullover Hoodie', price: 60, category: 'hoodies', gender: 'unisex' },
  { id: '3', name: 'Team Scarf', price: 25, category: 'scarves', gender: 'unisex' },
  { id: '4', name: 'Blue Baseball Cap', price: 30, category: 'hats', gender: 'unisex' },
  { id: '5', name: 'Jerseys', price: 75, category: 'jerseys', gender: 'unisex' },
  { id: '6', name: "Women's Hoodie", price: 20, category: 'hoodies', gender: 'womens' },
  { id: '7', name: 'Beanie', price: 25, category: 'hats', gender: 'unisex' },
  { id: '8', name: 'Shorts', price: 70, category: 'jerseys', gender: 'unisex' },
  { id: '9', name: 'Socks', price: 20, category: 'jerseys', gender: 'unisex' },
  { id: '10', name: 'Training Top', price: 10, category: 'hoodies', gender: 'unisex' }
];

export default function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [maxPrice, setMaxPrice] = useState(75);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Fetch products from backend Express API with fallback
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('API server issue');
        const data = await response.json();
        if (data && data.length > 0) {
          // Normalize backend category/gender fields to match frontend filter keys if needed
          const normalized = data.map(p => ({
            ...p,
            category: p.category ? p.category.toLowerCase() : 'jerseys',
            gender: p.gender ? p.gender.toLowerCase() : 'unisex'
          }));
          setProducts(normalized);
        } else {
          // Empty data fallback
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.warn('Backend API not available or Supabase connection offline. Falling back to local mock products.', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on active sidebar selections
  const filteredProducts = products.filter(product => {
    // 1. Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category.toLowerCase())) {
      return false;
    }
    // 2. Gender Filter
    if (selectedGenders.length > 0 && !selectedGenders.includes(product.gender.toLowerCase())) {
      return false;
    }
    // 3. Price Filter
    if (product.price > maxPrice) {
      return false;
    }
    return true;
  });

  // Cart operations
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/stadium_bg.png')" }}
    >
      {/* Translucent stadium overlay to match mockup */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation header */}
        <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

        {/* Main layout container */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-grow w-full flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filter Section */}
          <SidebarFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedGenders={selectedGenders}
            setSelectedGenders={setSelectedGenders}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            products={products}
          />

          {/* Right Product Grid Section */}
          <div className="flex-grow flex flex-col gap-6">
            {loading ? (
              <div className="flex-grow flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-acme-navy"></div>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-md flex flex-col items-center gap-4">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-700">No products found</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Try resetting your filters or adjusting your price slider to discover items.
                    </p>
                  </div>
                ) : (
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    id="product-grid"
                    data-testid="product-grid"
                  >
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
                
                {/* Result counter matching mockup */}
                <div className="text-center text-sm font-semibold text-gray-600 mt-4">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-acme-navy text-white text-center py-6 text-xs font-semibold tracking-wider uppercase border-t border-acme-navyDark">
          © {new Date().getFullYear()} Acme FC - The Hammers. Established 1990. All Rights Reserved.
        </footer>
      </div>

      {/* Cart Slider Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out shadow-2xl">
                <div className="flex h-full flex-col bg-white rounded-l-3xl border-l border-gray-150">
                  {/* Cart Header */}
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-acme-navy flex items-center gap-2" id="slide-over-title">
                      <ShoppingBag className="w-5 h-5" />
                      Shopping Cart ({cartCount})
                    </h2>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      id="close-cart"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {checkoutSuccess ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
                        <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
                        <h3 className="text-2xl font-bold text-gray-800">Order Placed!</h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                          Thank you for shopping at Acme FC. Your order is pending verification.
                        </p>
                      </div>
                    ) : cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                        <ShoppingBag className="w-16 h-16 text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-700 font-serif">Your cart is empty</h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                          Explore our collection and add official gear to your cart to support The Hammers.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map(item => (
                          <div 
                            key={item.product.id} 
                            className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm"
                            data-testid="cart-item"
                          >
                            <img 
                              src={`https://placehold.co/100x100/0b3c5d/ffffff?text=${encodeURIComponent(item.product.name)}`}
                              alt={item.product.name} 
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-800 truncate">{item.product.name}</h4>
                              <p className="text-xs font-semibold text-acme-navyLight uppercase">{item.product.category}</p>
                              <span className="text-sm font-extrabold text-acme-navy">${item.product.price}</span>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center border border-gray-200 rounded-full bg-white px-2 py-0.5">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, -1)}
                                  className="p-1 text-gray-400 hover:text-acme-navy transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold px-2" data-testid="cart-item-qty">{item.quantity}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, 1)}
                                  className="p-1 text-gray-400 hover:text-acme-navy transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <button 
                                onClick={() => handleRemoveFromCart(item.product.id)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                                data-testid="remove-from-cart-button"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && !checkoutSuccess && (
                    <div className="border-t border-gray-100 px-6 py-6 bg-gray-50 rounded-b-3xl">
                      <div className="flex justify-between text-base font-bold text-gray-800 mb-4">
                        <span>Subtotal</span>
                        <span data-testid="cart-subtotal">${cartSubtotal}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-6 font-medium">
                        Shipping, taxes, and discounts calculated at checkout.
                      </p>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-acme-navy hover:bg-acme-navyDark text-white py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg focus:outline-none"
                        id="checkout-button"
                        data-testid="checkout-button"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
