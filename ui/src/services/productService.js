import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

// Get all products
export async function getAllProducts() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }
    
    return {
      id: productDoc.id,
      ...productDoc.data()
    };
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

// Get products by category
export async function getProductsByCategory(category) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
}

// Add a new product (admin only)
export async function addProduct(productData, imageFile) {
  try {
    let imageUrl = '';
    
    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    const newProduct = {
      ...productData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'products'), newProduct);
    return {
      id: docRef.id,
      ...newProduct
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Update a product (admin only)
export async function updateProduct(id, productData, imageFile) {
  try {
    let updateData = { ...productData, updatedAt: serverTimestamp() };
    
    // Upload new image if provided
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(storageRef);
    }
    
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updateData);
    
    return {
      id,
      ...updateData
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete a product (admin only)
export async function deleteProduct(id) {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    return { id };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
} 