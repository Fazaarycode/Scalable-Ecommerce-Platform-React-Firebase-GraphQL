import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      
      // Call the actual API
      const response = await api.getProducts();
      console.log('API response:', response);
      
      if (response && response.products) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to load products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    let filteredProducts = [...products];
    
    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filters.category
      );
    }
    
    // Apply price filters
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filteredProducts;
  };

  const filteredProducts = applyFilters();
  
  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="products-page container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page container">
      <h1>All Products</h1>
      
      <div className="products-container">
        <div className="filters-sidebar">
          <h2>Filters</h2>
          
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price</label>
            <input 
              type="number" 
              id="minPrice" 
              name="minPrice" 
              value={filters.minPrice} 
              onChange={handleFilterChange}
              className="filter-input"
              min="0"
              step="0.01"
              placeholder="Min Price"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input 
              type="number" 
              id="maxPrice" 
              name="maxPrice" 
              value={filters.maxPrice} 
              onChange={handleFilterChange}
              className="filter-input"
              min="0"
              step="0.01"
              placeholder="Max Price"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <select 
              id="sortBy" 
              name="sortBy" 
              value={filters.sortBy} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>
        
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your filters.</p>
              <button 
                onClick={() => setFilters({
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'name'
                })} 
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <p className="product-category">{product.category}</p>
                </div>
                <div className="product-actions">
                  <Link to={`/products/${product.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 