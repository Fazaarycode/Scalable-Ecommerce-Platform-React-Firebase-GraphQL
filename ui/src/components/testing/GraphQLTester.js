import React, { useState, useEffect } from 'react';
import { graphqlTests } from '../../tests/graphql-test';
import { useAuth } from '../../contexts/AuthContext';
import './GraphQLTester.css';

export default function GraphQLTester() {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    // Check connection to GraphQL endpoint
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      // Simple query to check if the GraphQL endpoint is reachable
      await graphqlTests.getProducts();
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('failed');
      addTestResult('Connection Check', null, `Failed to connect to GraphQL endpoint: ${error.toString()}`);
    }
  };

  const addTestResult = (name, result, error = null) => {
    setTestResults(prev => [
      {
        id: Date.now(),
        name,
        result: error ? null : result,
        error,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const runTest = async (testName, testFn, ...args) => {
    setLoading(true);
    try {
      const result = await testFn(...args);
      addTestResult(testName, result);
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
      
      // Extract more detailed error information
      let errorMessage = error.toString();
      if (error.response && error.response.errors) {
        errorMessage = JSON.stringify(error.response.errors, null, 2);
      }
      
      addTestResult(testName, null, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="graphql-tester">
      <h1>GraphQL API Tester</h1>
      
      <div className={`connection-status status-${connectionStatus}`}>
        <p>
          {connectionStatus === 'unknown' && '⚠️ Connection status unknown'}
          {connectionStatus === 'checking' && '🔄 Checking connection...'}
          {connectionStatus === 'connected' && '✅ Connected to GraphQL endpoint'}
          {connectionStatus === 'failed' && '❌ Failed to connect to GraphQL endpoint'}
        </p>
        {connectionStatus === 'failed' && (
          <button onClick={checkConnection} className="retry-btn">
            Retry Connection
          </button>
        )}
      </div>
      
      {!currentUser && (
        <div className="auth-warning">
          <p>⚠️ You are not logged in. Cart operations require authentication.</p>
          <p>Please log in to test cart functionality.</p>
        </div>
      )}
      
      <div className="test-controls">
        <div className="test-buttons">
          <button 
            onClick={() => runTest('Get Products', graphqlTests.getProducts)}
            disabled={loading}
          >
            Test Get Products
          </button>
          
          <div className="test-input-group">
            <input
              type="text"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <button 
              onClick={() => runTest('Get Product', graphqlTests.getProduct, productId)}
              disabled={!productId || loading}
            >
              Test Get Product
            </button>
          </div>
          
          <div className="test-input-group">
            <input
              type="text"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
            />
            <button 
              onClick={() => runTest('Add To Cart', graphqlTests.addToCart, productId, quantity)}
              disabled={!productId || loading || !currentUser}
            >
              Test Add To Cart
            </button>
          </div>
          
          <div className="test-input-group">
            <input
              type="text"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <button 
              onClick={() => runTest('Remove From Cart', graphqlTests.removeFromCart, productId)}
              disabled={!productId || loading || !currentUser}
            >
              Test Remove From Cart
            </button>
          </div>
          
          <button 
            onClick={() => runTest('Get Cart', graphqlTests.getCart)}
            disabled={loading || !currentUser}
          >
            Test Get Cart
          </button>
          
          <button 
            onClick={() => runTest('Run All Tests', graphqlTests.runAll)}
            disabled={loading}
            className="run-all-btn"
          >
            Run All Tests
          </button>
          
          <button 
            onClick={clearResults}
            className="clear-results-btn"
          >
            Clear Results
          </button>
        </div>
      </div>
      
      <div className="test-results">
        <h2>Test Results</h2>
        {loading && <div className="loading">Running test...</div>}
        
        {testResults.length === 0 ? (
          <p>No tests run yet</p>
        ) : (
          <div className="results-list">
            {testResults.map(result => (
              <div key={result.id} className={`result-item ${result.error ? 'error' : 'success'}`}>
                <div className="result-header">
                  <h3>{result.name}</h3>
                  <span className="timestamp">{result.timestamp}</span>
                </div>
                
                {result.error ? (
                  <div className="error-message">
                    <pre>{result.error}</pre>
                  </div>
                ) : (
                  <pre className="result-data">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 