// This is a reference for our Firestore collections structure

/*
Collections:
- users
  {
    uid: string
    email: string
    role: 'admin' | 'customer'
    createdAt: timestamp
    displayName?: string
    photoURL?: string
  }

- products
  {
    id: string
    name: string
    price: number
    imageUrl: string
    category: string
    stock: number
    discount?: number
    description: string
    createdAt: timestamp
    updatedAt: timestamp
  }

- carts
  {
    userId: string
    items: [
      {
        productId: string
        quantity: number
        price: number
      }
    ]
    total: number
    updatedAt: timestamp
  }

- orders
  {
    orderId: string
    userId: string
    items: [
      {
        productId: string
        quantity: number
        price: number
      }
    ]
    total: number
    status: 'pending' | 'shipped' | 'delivered'
    shippingAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    createdAt: timestamp
    updatedAt: timestamp
  }
*/ 