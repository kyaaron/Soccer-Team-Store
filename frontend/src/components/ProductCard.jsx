import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  // Cohesive branding placeholder images using placehold.co
  // Using Acme Navy as background (#0b3c5d) and gold/white text
  const placeholderUrl = `https://placehold.co/400x400/0b3c5d/ffffff?text=${encodeURIComponent(product.name)}`;

  return (
    <article
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-150 transition-all duration-300 flex flex-col group relative"
      data-testid="product-card"
      data-product-id={product.id}
      data-product-name={product.name}
      data-product-price={product.price}
      data-product-category={product.category}
      data-product-gender={product.gender}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center p-6">
        <img
          src={placeholderUrl}
          alt={product.name}
          className="w-full h-full object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Hover overlay with quick Add to Cart button */}
        <div className="absolute inset-0 bg-acme-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-white text-acme-navy hover:bg-acme-gold hover:text-white px-5 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-350"
            id={`add-to-cart-hover-${product.id}`}
            data-testid="add-to-cart-button-hover"
          >
            <ShoppingBag className="w-5 h-5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-acme-navyLight">
            {product.category}
          </span>
          <h3 className="text-base font-bold text-gray-800 line-clamp-1 mt-1 group-hover:text-acme-navy transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <span className="text-lg font-extrabold text-acme-navy">
            ${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2.5 rounded-full bg-gray-50 text-acme-navy hover:bg-acme-navy hover:text-white transition-colors duration-200"
            id={`add-to-cart-${product.id}`}
            data-testid="add-to-cart-button"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
