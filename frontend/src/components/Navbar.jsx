import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Name */}
        <div className="flex items-center space-x-2">
          <a href="#" className="flex items-center">
            {/* Logo placeholder as requested by AGENTS.md (no svg, standard img with href="#") */}
            <img src="#" alt="Acme FC Logo" className="hidden" />
            <span className="text-2xl font-black tracking-wider text-acme-navy font-sans">
              ACME FC
            </span>
          </a>
        </div>

        {/* Middle: Page Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-acme-navy text-center flex-grow md:flex-grow-0">
          Team Store
        </h1>

        {/* Right: Cart Icon with Badge */}
        <button
          onClick={onCartClick}
          className="relative p-2 text-acme-navy hover:text-acme-navyLight transition-colors duration-200 focus:outline-none"
          aria-label="Shopping Cart"
          id="cart-button"
        >
          <ShoppingCart className="w-7 h-7 stroke-[2]" />
          {cartCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 bg-acme-navy text-white text-xs font-bold rounded-full w-5.5 h-5.5 flex items-center justify-center border-2 border-white shadow-md animate-bounce"
              id="cart-badge"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
