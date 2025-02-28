import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    searchQuery: ''
  });
  
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log('Fetching products...');
        const response = await api.getProducts();
        console.log('Products response:', response);
        
        if (response && response.products) {
          setProducts(response.products);
          setFilteredProducts(response.products);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(response.products.map(product => product.category))];
          setCategories(uniqueCategories);
        } else {
          setError('No products found or invalid response format');
        }
      } catch (error) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply search filter locally
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [filters.searchQuery, products]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      searchQuery: ''
    });
  };

  const handleAddToCart = async (product) => {
    if (!currentUser) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      await api.addToCart(product.id, 1);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="filters-container">
        <h2>Filters</h2>
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
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
            min="0"
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
            min="0"
          />
        </div>
        
        <div className="filter-group checkbox">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={filters.inStock}
            onChange={handleFilterChange}
          />
          <label htmlFor="inStock">In Stock Only</label>
        </div>
        
        <div className="filter-group">
          <label htmlFor="searchQuery">Search</label>
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleFilterChange}
            placeholder="Search products..."
          />
        </div>
        
        <button className="reset-filters-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
      
      <div className="products-grid">
        <h1>Products</h1>
        
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found matching your criteria.</p>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">
                  ${product.price.toFixed(2)}
                </p>
                <p className="product-category">{product.category}</p>
                <p className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="product-actions">
                  <Link to={`/products/${product.id}`} className="view-details-btn">
                    View Details
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 