const axios = require('axios');

const BASE_URL = 'http://localhost:5454';

// Test data
let authToken = '';
let userId = '';
let productId = '';
let cartId = '';
let orderId = '';

// Helper function to make authenticated requests
const makeAuthRequest = async (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
const testAuthAPIs = async () => {
  console.log('\n🔐 Testing Authentication APIs...');
  
  try {
    // Generate unique email
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    
    // Test signup
    console.log('Testing POST /auth/signup...');
    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'password123',
      mobile: '1234567890',
      gender: 'Male'
    });
    console.log('✅ Signup successful:', signupResponse.data);
    
    // Test signin
    console.log('Testing POST /auth/signin...');
    const signinResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      email: testEmail,
      password: 'password123'
    });
    console.log('✅ Signin successful:', signinResponse.data);
    authToken = signinResponse.data.jwt;
    userId = signinResponse.data.user._id;
    
  } catch (error) {
    console.log('❌ Auth test failed:', error.response?.data || error.message);
    
    // If signup fails due to existing user, try to signin with existing user
    if (error.response?.data?.error?.includes('already exists')) {
      console.log('🔄 User already exists, trying to signin...');
      try {
        const signinResponse = await axios.post(`${BASE_URL}/auth/signin`, {
          email: 'testuser@example.com',
          password: 'password123'
        });
        console.log('✅ Signin successful:', signinResponse.data);
        authToken = signinResponse.data.jwt;
        userId = signinResponse.data.user._id;
      } catch (signinError) {
        console.log('❌ Signin also failed:', signinError.response?.data || signinError.message);
      }
    }
  }
};

const testUserAPIs = async () => {
  console.log('\n👤 Testing User APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping user APIs - no auth token');
    return;
  }
  
  try {
    // Test get user profile
    console.log('Testing GET /api/users/profile...');
    const profileResponse = await makeAuthRequest('GET', '/api/users/profile');
    console.log('✅ Get profile successful:', profileResponse.data);
    
    // Test get all users
    console.log('Testing GET /api/users...');
    const usersResponse = await makeAuthRequest('GET', '/api/users');
    console.log('✅ Get all users successful:', usersResponse.data);
    
  } catch (error) {
    console.log('❌ User API test failed:', error.response?.data || error.message);
  }
};

const testProductAPIs = async () => {
  console.log('\n📦 Testing Product APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping product APIs - no auth token');
    return;
  }
  
  try {
    // Test get all products
    console.log('Testing GET /api/products...');
    const productsResponse = await makeAuthRequest('GET', '/api/products');
    console.log('✅ Get all products successful:', productsResponse.data);
    
    if (productsResponse.data.content && productsResponse.data.content.length > 0) {
      productId = productsResponse.data.content[0]._id;
      
      // Test get product by ID
      console.log('Testing GET /api/products/id/:id...');
      const productResponse = await makeAuthRequest('GET', `/api/products/id/${productId}`);
      console.log('✅ Get product by ID successful:', productResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Product API test failed:', error.response?.data || error.message);
  }
};

const testAdminProductAPIs = async () => {
  console.log('\n🛠️ Testing Admin Product APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping admin product APIs - no auth token');
    return;
  }
  
  try {
    // Test create product with correct sizes structure
    console.log('Testing POST /api/admin/products...');
    const createProductResponse = await makeAuthRequest('POST', '/api/admin/products', {
      title: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      discountedPrice: 79.99,
      discountPersent: 20,
      quantity: 100,
      brand: 'Test Brand',
      color: 'Red',
      sizes: [
        { name: 'S', quantity: 25 },
        { name: 'M', quantity: 30 },
        { name: 'L', quantity: 25 },
        { name: 'XL', quantity: 20 }
      ],
      imageUrl: 'https://example.com/image.jpg',
      topLevelCategory: 'Clothing',
      secondLevelCategory: 'Shirts',
      thirdLevelCategory: 'Casual Shirts'
    });
    console.log('✅ Create product successful:', createProductResponse.data);
    
    // Test create multiple products
    console.log('Testing POST /api/admin/products/creates...');
    const createMultipleResponse = await makeAuthRequest('POST', '/api/admin/products/creates', [
      {
        title: 'Test Product 2',
        description: 'This is another test product',
        price: 149.99,
        discountedPrice: 119.99,
        discountPersent: 20,
        quantity: 50,
        brand: 'Test Brand 2',
        color: 'Blue',
        sizes: [
          { name: 'M', quantity: 15 },
          { name: 'L', quantity: 20 },
          { name: 'XL', quantity: 15 }
        ],
        imageUrl: 'https://example.com/image2.jpg',
        topLevelCategory: 'Clothing',
        secondLevelCategory: 'Pants',
        thirdLevelCategory: 'Jeans'
      }
    ]);
    console.log('✅ Create multiple products successful:', createMultipleResponse.data);
    
    // Test update product
    if (productId) {
      console.log('Testing PUT /api/admin/products/:id...');
      const updateResponse = await makeAuthRequest('PUT', `/api/admin/products/${productId}`, {
        title: 'Updated Test Product',
        price: 129.99
      });
      console.log('✅ Update product successful:', updateResponse.data);
    }
    
    // Test delete product
    if (productId) {
      console.log('Testing DELETE /api/admin/products/:id...');
      const deleteResponse = await makeAuthRequest('DELETE', `/api/admin/products/${productId}`);
      console.log('✅ Delete product successful:', deleteResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Admin Product API test failed:', error.response?.data || error.message);
  }
};

const testCartAPIs = async () => {
  console.log('\n🛒 Testing Cart APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping cart APIs - no auth token');
    return;
  }
  
  try {
    // Test get user cart
    console.log('Testing GET /api/cart...');
    const cartResponse = await makeAuthRequest('GET', '/api/cart');
    console.log('✅ Get user cart successful:', cartResponse.data);
    
    if (cartResponse.data.cart) {
      cartId = cartResponse.data.cart._id;
    }
    
    // Test add item to cart
    if (productId) {
      console.log('Testing PUT /api/cart/add...');
      const addItemResponse = await makeAuthRequest('PUT', '/api/cart/add', {
        productId: productId,
        size: 'M',
        quantity: 2
      });
      console.log('✅ Add item to cart successful:', addItemResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Cart API test failed:', error.response?.data || error.message);
  }
};

const testCartItemAPIs = async () => {
  console.log('\n📋 Testing Cart Item APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping cart item APIs - no auth token');
    return;
  }
  
  try {
    // Get cart items first
    const cartResponse = await makeAuthRequest('GET', '/api/cart');
    if (cartResponse.data.cart && cartResponse.data.cart.cartItems && cartResponse.data.cart.cartItems.length > 0) {
      const cartItemId = cartResponse.data.cart.cartItems[0]._id;
      
      // Test update cart item
      console.log('Testing PUT /api/cart_items/:id...');
      const updateResponse = await makeAuthRequest('PUT', `/api/cart_items/${cartItemId}`, {
        quantity: 3
      });
      console.log('✅ Update cart item successful:', updateResponse.data);
      
      // Test remove cart item
      console.log('Testing DELETE /api/cart_items/:id...');
      const removeResponse = await makeAuthRequest('DELETE', `/api/cart_items/${cartItemId}`);
      console.log('✅ Remove cart item successful:', removeResponse.data);
    } else {
      console.log('⚠️ No cart items found to test');
    }
    
  } catch (error) {
    console.log('❌ Cart Item API test failed:', error.response?.data || error.message);
  }
};

const testOrderAPIs = async () => {
  console.log('\n📦 Testing Order APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping order APIs - no auth token');
    return;
  }
  
  try {
    // Test create order with correct address structure
    console.log('Testing POST /api/orders...');
    const createOrderResponse = await makeAuthRequest('POST', '/api/orders', {
      firstName: 'Test',
      lastName: 'User',
      streetAddress: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: 12345,
      mobile: '1234567890'
    });
    console.log('✅ Create order successful:', createOrderResponse.data);
    
    if (createOrderResponse.data.order) {
      orderId = createOrderResponse.data.order._id;
    }
    
    // Test get order history
    console.log('Testing GET /api/orders/user...');
    const historyResponse = await makeAuthRequest('GET', '/api/orders/user');
    console.log('✅ Get order history successful:', historyResponse.data);
    
    // Test get order by ID
    if (orderId) {
      console.log('Testing GET /api/orders/:id...');
      const orderResponse = await makeAuthRequest('GET', `/api/orders/${orderId}`);
      console.log('✅ Get order by ID successful:', orderResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Order API test failed:', error.response?.data || error.message);
  }
};

const testAdminOrderAPIs = async () => {
  console.log('\n🛠️ Testing Admin Order APIs...');
  
  if (!authToken) {
    console.log('⚠️ Skipping admin order APIs - no auth token');
    return;
  }
  
  try {
    // Test get all orders
    console.log('Testing GET /api/admin/orders...');
    const ordersResponse = await makeAuthRequest('GET', '/api/admin/orders');
    console.log('✅ Get all orders successful:', ordersResponse.data);
    
    if (orderId) {
      // Test confirm order
      console.log('Testing PUT /api/admin/orders/:orderId/confirmed...');
      const confirmResponse = await makeAuthRequest('PUT', `/api/admin/orders/${orderId}/confirmed`);
      console.log('✅ Confirm order successful:', confirmResponse.data);
      
      // Test ship order
      console.log('Testing PUT /api/admin/orders/:orderId/ship...');
      const shipResponse = await makeAuthRequest('PUT', `/api/admin/orders/${orderId}/ship`);
      console.log('✅ Ship order successful:', shipResponse.data);
      
      // Test deliver order
      console.log('Testing PUT /api/admin/orders/:orderId/deliver...');
      const deliverResponse = await makeAuthRequest('PUT', `/api/admin/orders/${orderId}/deliver`);
      console.log('✅ Deliver order successful:', deliverResponse.data);
      
      // Test cancel order
      console.log('Testing PUT /api/admin/orders/:orderId/cancel...');
      const cancelResponse = await makeAuthRequest('PUT', `/api/admin/orders/${orderId}/cancel`);
      console.log('✅ Cancel order successful:', cancelResponse.data);
      
      // Test delete order
      console.log('Testing PUT /api/admin/orders/:orderId/delete...');
      const deleteResponse = await makeAuthRequest('PUT', `/api/admin/orders/${orderId}/delete`);
      console.log('✅ Delete order successful:', deleteResponse.data);
    }
    
  } catch (error) {
    console.log('❌ Admin Order API test failed:', error.response?.data || error.message);
  }
};

const testReviewAPIs = async () => {
  console.log('\n⭐ Testing Review APIs...');
  
  if (!authToken || !productId) {
    console.log('⚠️ Skipping review APIs - no auth token or product ID');
    return;
  }
  
  try {
    // Test create review
    console.log('Testing POST /api/reviews/create...');
    const createReviewResponse = await makeAuthRequest('POST', '/api/reviews/create', {
      productId: productId,
      review: 'This is a great product!',
      rating: 5
    });
    console.log('✅ Create review successful:', createReviewResponse.data);
    
    // Test get all reviews for product
    console.log('Testing GET /api/reviews/product/:productId...');
    const reviewsResponse = await makeAuthRequest('GET', `/api/reviews/product/${productId}`);
    console.log('✅ Get product reviews successful:', reviewsResponse.data);
    
  } catch (error) {
    console.log('❌ Review API test failed:', error.response?.data || error.message);
  }
};

const testRatingAPIs = async () => {
  console.log('\n📊 Testing Rating APIs...');
  
  if (!authToken || !productId) {
    console.log('⚠️ Skipping rating APIs - no auth token or product ID');
    return;
  }
  
  try {
    // Test create rating
    console.log('Testing POST /api/ratings/create...');
    const createRatingResponse = await makeAuthRequest('POST', '/api/ratings/create', {
      productId: productId,
      rating: 4.5
    });
    console.log('✅ Create rating successful:', createRatingResponse.data);
    
    // Test get all ratings for product
    console.log('Testing PUT /api/ratings/product/:productId...');
    const ratingsResponse = await makeAuthRequest('PUT', `/api/ratings/product/${productId}`);
    console.log('✅ Get product ratings successful:', ratingsResponse.data);
    
  } catch (error) {
    console.log('❌ Rating API test failed:', error.response?.data || error.message);
  }
};

const testRootAPI = async () => {
  console.log('\n🏠 Testing Root API...');
  
  try {
    console.log('Testing GET /...');
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root API successful:', response.data);
  } catch (error) {
    console.log('❌ Root API test failed:', error.response?.data || error.message);
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting API Tests...');
  console.log('=====================================');
  
  try {
    await testRootAPI();
    await testAuthAPIs();
    await testUserAPIs();
    await testProductAPIs();
    await testAdminProductAPIs();
    await testCartAPIs();
    await testCartItemAPIs();
    await testOrderAPIs();
    await testAdminOrderAPIs();
    await testReviewAPIs();
    await testRatingAPIs();
    
    console.log('\n=====================================');
    console.log('✅ All API tests completed!');
    
  } catch (error) {
    console.log('\n=====================================');
    console.log('❌ Test suite failed:', error.message);
  }
};

// Run the tests
runAllTests(); 