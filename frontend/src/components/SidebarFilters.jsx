import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function SidebarFilters({
  selectedCategories,
  setSelectedCategories,
  selectedGenders,
  setSelectedGenders,
  maxPrice,
  setMaxPrice,
  minPrice,
  products
}) {
  
  const categoriesList = [
    { id: 'jerseys', name: 'Jerseys', icon: '👕' },
    { id: 'hoodies', name: 'Hoodies', icon: '🧥' },
    { id: 'hats', name: 'Hats', icon: '🧢' },
    { id: 'scarves', name: 'Scarves', icon: '🧣' }
  ];

  const gendersList = [
    { id: 'unisex', name: "Men's & Unisex" },
    { id: 'womens', name: "Women's" }
  ];

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleGenderChange = (genderId) => {
    if (selectedGenders.includes(genderId)) {
      setSelectedGenders(selectedGenders.filter(id => id !== genderId));
    } else {
      setSelectedGenders([...selectedGenders, genderId]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setMaxPrice(75);
  };

  return (
    <aside className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex flex-col gap-6 w-full lg:w-72 self-start">
      <div className="flex items-center justify-between border-b border-gray-150 pb-4">
        <h2 className="text-xl font-bold text-acme-navy flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Shop By:
        </h2>
        {(selectedCategories.length > 0 || selectedGenders.length > 0 || maxPrice < 75) && (
          <button 
            onClick={clearFilters}
            className="text-xs text-acme-navyLight hover:text-acme-navyDark font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">Category</h3>
        <div className="flex flex-col gap-2">
          {categoriesList.map(category => (
            <label 
              key={category.id} 
              className="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-acme-navy transition-colors select-none"
              id={`category-${category.id}-label`}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-5 h-5 rounded border-gray-300 text-acme-navy focus:ring-acme-navy accent-acme-navy cursor-pointer"
                id={`category-${category.id}`}
              />
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">Gender</h3>
        <div className="flex flex-col gap-2">
          {gendersList.map(gender => (
            <label 
              key={gender.id} 
              className="flex items-center gap-3 cursor-pointer text-gray-600 hover:text-acme-navy transition-colors select-none"
              id={`gender-${gender.id}-label`}
            >
              <input
                type="checkbox"
                checked={selectedGenders.includes(gender.id)}
                onChange={() => handleGenderChange(gender.id)}
                className="w-5 h-5 rounded border-gray-300 text-acme-navy focus:ring-acme-navy accent-acme-navy cursor-pointer"
                id={`gender-${gender.id}`}
              />
              <span className="text-sm font-medium">{gender.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">Price Range</h3>
          <span className="text-xs font-bold text-acme-navy bg-gray-100 px-2 py-0.5 rounded">
            Up to ${maxPrice}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min="10"
            max="75"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-acme-navy focus:outline-none"
            id="price-range"
          />
          <div className="flex justify-between text-xs text-gray-400 font-semibold">
            <span>$10</span>
            <span>$75</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
