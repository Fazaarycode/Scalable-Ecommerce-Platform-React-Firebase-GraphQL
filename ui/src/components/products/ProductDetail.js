import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { imageArray } from '../../pages/imageUtils';
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  TextField,
  ButtonGroup,
  Grid
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      try {
        const productData = await api.getProductById(productId);
        const updatedProduct = {
          ...productData,
          image: productData.images?.length > 0
            ? productData.images[0]
            : imageArray[Math.floor(Math.random() * imageArray.length)]
        };
        setProduct(updatedProduct);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/products/${productId}` } });
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
      alert(`Added ${quantity} of ${product.name} to cart!`);
    } finally {
      setAddingToCart(false);
    }
  };

  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Box mt={4}><Alert severity="error">{error}</Alert></Box>;
  if (!product) return <Box mt={4}><Typography variant="h6">Product not found</Typography></Box>;

  return (
    <Box maxWidth="900px" mx="auto" p={2}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
        Back to Products
      </Button>

      <Card>
        <Grid container spacing={2}>
          {/* Image Section */}
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              height="100%"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h4" gutterBottom>{product.name}</Typography>
              <Typography variant="h6" color="primary">${product.price?.toFixed(2) || '0.00'}</Typography>
              <Typography color={product.inStock ? 'green' : 'red'} fontWeight="bold">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Typography>
              <Typography variant="body2" color="textSecondary">Category: {product.category}</Typography>
              <Typography variant="body1" mt={2}>{product.description}</Typography>
              <Box mt={2} display="flex" alignItems="center">
                <Typography variant="body1" mr={2}>Quantity:</Typography>
                <ButtonGroup>
                  <Button onClick={decrementQuantity} disabled={quantity === 1}>-</Button>
                  <TextField 
                    size="small"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    sx={{ width: '50px', textAlign: 'center' }}
                  />
                  <Button onClick={incrementQuantity}>+</Button>
                </ButtonGroup>
              </Box>
              <Button 
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                sx={{ mt: 2 }}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
