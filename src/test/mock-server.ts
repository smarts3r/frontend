import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
};

const mockAdminUser = {
  id: '2',
  email: 'dev@email.com',
  firstName: "ADMIN",
  lastName: 'User',
  role: "ADMIN"
};

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 29.99,
  category: 'electronics',
  imageUrl: 'https://example.com/image.jpg',
  stock: 10,
  rating: 4.5
};

const mockCategory = {
  id: '1',
  name: 'Electronics',
  description: 'Electronic devices and accessories'
};

const mockOrder = {
  id: '1',
  userId: '1',
  items: [{
    id: '1',
    productId: '1',
    productName: 'Test Product',
    quantity: 2,
    price: 29.99
  }],
  totalAmount: 59.98,
  status: 'pending',
  shippingAddress: '123 Main St, City, State',
  paymentMethod: 'credit_card',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
};

const mockCart = [
  {
    id: '1',
    productId: '1',
    quantity: 2,
    product: mockProduct
  }
];

const mockWishlist = [
  {
    id: '1',
    productId: '1',
    product: mockProduct
  }
];

// Define request handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any;

    if (body.email === 'dev@email.com' && body.password === 'dev132') {
      return HttpResponse.json({
        token: 'mock-admin-token',
        user: mockAdminUser
      });
    } else if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-user-token',
        user: mockUser
      });
    } else {
      return new HttpResponse(null, { status: 401 });
    }
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      token: 'mock-register-token',
      user: {
        id: '3',
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName
      }
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({});
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({ token: 'mock-refreshed-token' });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json(mockUser);
  }),

  // Products endpoints
  http.get('/api/products', () => {
    return HttpResponse.json([mockProduct]);
  }),

  http.get('/api/products/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockProduct);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/products', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      ...body,
      id: '2'
    });
  }),

  http.put('/api/products/:id', async ({ request, params }) => {
    const body = await request.json() as any;
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockProduct,
        ...body
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/products/:id', ({ params }) => {
    if (params.id === '1') {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('/api/user/products', () => {
    return HttpResponse.json([mockProduct]);
  }),

  http.get('/api/user/products/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockProduct);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Categories endpoints
  http.get('/api/categories', () => {
    return HttpResponse.json([mockCategory]);
  }),

  http.get('/api/categories/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockCategory);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/categories', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      ...body,
      id: '2'
    });
  }),

  http.put('/api/categories/:id', async ({ request, params }) => {
    const body = await request.json() as any;
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockCategory,
        ...body
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/categories/:id', ({ params }) => {
    if (params.id === '1') {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // User endpoints
  http.get('/api/user/profile', () => {
    return HttpResponse.json(mockUser);
  }),

  http.get('/api/user/cart', () => {
    return HttpResponse.json(mockCart);
  }),

  http.post('/api/user/cart', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: '2',
      productId: body.productId,
      quantity: body.quantity,
      product: mockProduct
    });
  }),

  http.put('/api/user/cart/:id', async ({ request, params }) => {
    const body = await request.json() as any;
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockCart[0],
        quantity: body.quantity
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/user/cart/:id', ({ params }) => {
    if (params.id === '1') {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/user/cart/clear', () => {
    return HttpResponse.json({});
  }),

  http.post('/api/user/cart/:id', async ({ request, params }) => {
    const body = await request.json() as any;
    if (body.method === 'DELETE' && params.id === '1') {
      return new HttpResponse(null, { status: 204 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('/api/user/wishlist', () => {
    return HttpResponse.json(mockWishlist);
  }),

  http.post('/api/user/wishlist/toggle', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ added: true });
  }),

  // Orders endpoints
  http.get('/api/user/orders', () => {
    return HttpResponse.json([mockOrder]);
  }),

  http.get('/api/user/orders/summary', () => {
    return HttpResponse.json({
      totalOrders: 5,
      totalRevenue: 299.95,
      pendingOrders: 2,
      processingOrders: 1
    });
  }),

  http.get('/api/user/orders/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockOrder);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/user/orders', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: '2',
      userId: '1',
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Test Product',
          quantity: 1,
          price: 29.99
        }
      ],
      paymentMethod: 'credit_card',
      shippingAddress: '123 Main St, City, State',
      totalAmount: 29.99,
      status: 'pending',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    });
  }),

  http.post('/api/user/orders/:id/cancel', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockOrder,
        status: 'cancelled'
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/user/orders/:id/confirm-delivery', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockOrder,
        status: 'delivered'
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Admin endpoints
  http.get('/api/admin/dashboard', () => {
    return HttpResponse.json({
      totalUsers: 100,
      totalProducts: 50,
      totalOrders: 200,
      totalRevenue: 15000,
      monthlySales: [
        { month: 'Jan', sales: 1200 },
        { month: 'Feb', sales: 1500 },
        { month: 'Mar', sales: 1800 }
      ]
    });
  }),

  http.get('/api/admin/orders', () => {
    return HttpResponse.json([{
      ...mockOrder,
      customerEmail: 'customer@example.com',
      customerName: 'Customer Name'
    }]);
  }),

  http.get('/api/admin/orders/export', () => {
    const csvContent = 'id,userId,status,total\n1,1,completed,29.99\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="orders-export.csv"'
      }
    });
  }),

  http.get('/api/admin/orders/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockOrder,
        customerEmail: 'customer@example.com',
        customerName: 'Customer Name'
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.put('/api/admin/orders/:id', async ({ request, params }) => {
    const body = await request.json() as any;
    if (params.id === '1') {
      return HttpResponse.json({
        ...mockOrder,
        customerEmail: 'customer@example.com',
        customerName: 'Customer Name',
        ...body
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post('/api/admin/orders/bulk-status', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({});
  }),

  http.get('/api/admin/stats', () => {
    return HttpResponse.json({
      revenue: 15000,
      orders: 200,
      customers: 100
    });
  }),

  http.get('/api/admin/csv/template', () => {
    return new HttpResponse(new Uint8Array([84, 69, 77, 80, 76, 65, 84, 69]), { // TEMPLATE text
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="template.csv"'
      }
    });
  }),

  http.get('/api/admin/csv/export', () => {
    return new HttpResponse(new Uint8Array([69, 88, 80, 79, 82, 84]), { // EXPORT text
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="products-export.csv"'
      }
    });
  }),

  http.post('/api/admin/csv/import', async ({ request }) => {
    // For testing purposes, just return success
    return HttpResponse.json({});
  }),

  http.post('/api/admin/upload', async ({ request }) => {
    // For testing purposes, return a mock URL
    return HttpResponse.json({
      url: 'https://example.com/uploaded/image.jpg'
    });
  })
];

// Setup server for Node.js environment
export const server = setupServer(...handlers);
