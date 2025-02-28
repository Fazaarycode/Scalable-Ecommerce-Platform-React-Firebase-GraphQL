// @ts-nocheck
const admin = require("../../database/database");

const cartMutations = {
  addToCart: async (_, { productId, quantity = 1, userId }, context) => {
    console.log('========== ADD TO CART MUTATION STARTED ==========');
    console.log('Parameters received:', { productId, quantity, userId });

    try {
      if (!userId) throw new Error('User not authenticated');

      const db = admin.db;
      
      // List all collections to verify products collection
      console.log('Listing all collections:');
      const collections = await db.listCollections();
      for (const collection of collections) {
        console.log('Collection found:', collection.id);
      }
      
      // Get products collection reference
      const productsRef = db.collection('products');
      
      // List some products to verify data
      console.log('Listing first few products:');
      const sampleProducts = await productsRef.limit(3).get();
      sampleProducts.forEach(doc => {
        console.log('Sample product ID:', doc.id);
        console.log('Sample product data:', doc.data());
      });
      
      // Now try to get the specific product
      console.log(`Fetching product details for ID: ${productId}`);
      const productDoc = await productsRef.doc(productId).get();
      
      if (!productDoc.exists) {
        console.log(`ERROR: Product ${productId} not found`);
        console.log('Trying alternative query...');
        
        // Try querying by a different field
        const productQuery = await productsRef.where('id', '==', productId).get();
        if (!productQuery.empty) {
          const product = productQuery.docs[0];
          console.log('Found product using query:', product.data());
          // Continue with this product...
        } else {
          throw new Error('Product not found');
        }
      }

      const product = productDoc.data();
      console.log('Product found:', JSON.stringify(product));

      // Get or create cart
      const cartRef = db.collection('carts').doc(userId);
      const cartDoc = await cartRef.get();
      
      let cart;
      if (!cartDoc.exists) {
        console.log('Creating new cart');
        cart = {
          items: [],
          products: [],
          total: 0,
          cartCount: 0
        };
      } else {
        cart = cartDoc.data();
        if (!cart.items) cart.items = [];
        if (!cart.products) cart.products = [];
      }

      // Add product with full details
      const productToAdd = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      };

      console.log('Product to add:', JSON.stringify(productToAdd));

      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        console.log('Updating existing item quantity');
        cart.items[existingItemIndex].quantity += quantity;
        
        // Update product in products array
        const productIndex = cart.products.findIndex(p => p.id === productId);
        if (productIndex >= 0) {
          cart.products[productIndex].quantity = cart.items[existingItemIndex].quantity;
        } else {
          // Product not in products array, add it
          cart.products.push(productToAdd);
        }
      } else {
        console.log('Adding new item to cart');
        // Add to items array
        cart.items.push({
          productId,
          quantity,
          userId
        });

        // Add to products array
        cart.products.push(productToAdd);
      }

      // Calculate total
      console.log('Calculating cart total');
      cart.total = cart.products.reduce((sum, p) => {
        console.log(`Adding to total: ${p.price} * ${p.quantity} = ${p.price * p.quantity}`);
        return sum + (p.price * p.quantity);
      }, 0);
      console.log('New cart total:', cart.total);

      // Calculate cart count
      console.log('Calculating cart count');
      cart.cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);
      console.log('New cart count:', cart.cartCount);

      // Save updated cart
      console.log('Saving cart to database:', JSON.stringify(cart));
      await cartRef.set(cart);

      // Return the complete cart object
      const finalCart = {
        ...cart,
        id: userId,
        userId: userId,
        products: cart.products, // Explicitly include products
        total: cart.total,      // Explicitly include total
        cartCount: cart.cartCount
      };

      console.log('Returning final cart:', JSON.stringify(finalCart));
      return finalCart;
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  },

  removeFromCart: async (_, { productId }, context) => {
    console.log('========== REMOVE FROM CART MUTATION STARTED ==========');
    console.log('Parameters received:');
    console.log('productId:', productId);
    console.log('context:', JSON.stringify(context));
    
    const userId = context.userId || context.guestId;
    console.log('userId from context:', userId);
    
    if (!userId) {
      console.log('ERROR: User not authenticated');
      throw new Error('User not authenticated');
    }
    console.log('User authenticated, proceeding with removeFromCart');

    try {
      console.log('Getting database reference');
      const db = admin.db;
      console.log('Database reference obtained successfully');
      
      console.log(`Fetching cart document for userId: ${userId}`);
      const cartRef = db.collection('carts').doc(userId);
      const cartDoc = await cartRef.get();
      console.log('Cart document fetch completed');
      
      if (!cartDoc.exists) {
        console.log(`No cart found for userId: ${userId}, returning default cart`);
        return { 
          id: userId,
          userId: userId,
          items: [],
          total: 0,
          products: [],
          cartCount: 0
        };
      }
      
      console.log('Cart document exists, processing data');
      const cart = cartDoc.data();
      console.log('Raw cart data:', JSON.stringify(cart));
      
      if (cart.items) {
        console.log(`Found ${cart.items.length} items in cart`);
        console.log(`Removing product ${productId} from cart`);
        cart.items = cart.items.filter(item => item.productId !== productId);
        console.log(`After removal: ${cart.items.length} items remain in cart`);
        
        // Calculate cart count
        console.log('Calculating cart count after removal');
        const cartCount = cart.items.reduce((total, item) => {
          console.log(`Item: ${item.productId}, Quantity: ${item.quantity || 1}`);
          return total + (item.quantity || 1);
        }, 0);
        console.log(`Total cart count after removal: ${cartCount}`);
        cart.cartCount = cartCount;
        
        console.log(`Saving updated cart to database for userId: ${userId}`);
        await cartRef.set(cart);
        console.log('Cart saved successfully to database after removal');
      } else {
        console.log('No items array found in cart, nothing to remove');
      }
      
      console.log('Preparing final cart object for response');
      const finalCart = {
        ...cart,
        id: userId,
        userId: userId,
        total: cart.total || 0,
        products: [], // Add empty products array to match schema
        cartCount: cart.cartCount || 0
      };
      
      console.log('Final cart object:', JSON.stringify(finalCart));
      console.log('========== REMOVE FROM CART MUTATION COMPLETED ==========');
      return finalCart;
    } catch (error) {
      console.error('========== ERROR IN REMOVE FROM CART MUTATION ==========');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
};

module.exports = cartMutations; 