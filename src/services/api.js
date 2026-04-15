const API_BASE = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.error || '请求失败', data.code, response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('网络错误，请检查连接', 'NETWORK_ERROR');
    }
  }

  // Auth
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(loginAccount, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { loginAccount, password }
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: data
    });
  }

  async adminLogin(username, password) {
    const data = await this.request('/auth/admin/login', {
      method: 'POST',
      body: { username, password }
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  // Cars
  async getCars(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/cars${query ? `?${query}` : ''}`);
  }

  async getCar(id) {
    return this.request(`/cars/${id}`);
  }

  async getCarTypes() {
    return this.request('/cars/meta/types');
  }

  async getCarBrands() {
    return this.request('/cars/meta/brands');
  }

  // Admin car management
  async createCar(carData) {
    return this.request('/cars', {
      method: 'POST',
      body: carData
    });
  }

  async updateCar(id, carData) {
    return this.request(`/cars/${id}`, {
      method: 'PUT',
      body: carData
    });
  }

  async deleteCar(id) {
    return this.request(`/cars/${id}`, {
      method: 'DELETE'
    });
  }

  // Stores
  async getStores(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/stores${query ? `?${query}` : ''}`);
  }

  async getStore(id) {
    return this.request(`/stores/${id}`);
  }

  // Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders${query ? `?${query}` : ''}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT'
    });
  }

  async payOrder(id, paymentMethod) {
    return this.request(`/orders/${id}/pay`, {
      method: 'POST',
      body: { payment_method: paymentMethod }
    });
  }

  // Admin orders
  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders/admin/all${query ? `?${query}` : ''}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/admin/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
  }

  async getOrderStats() {
    return this.request('/orders/admin/stats');
  }

  // Reviews
  async createReview(orderId, reviewData) {
    return this.request(`/orders/${orderId}/review`, {
      method: 'POST',
      body: reviewData
    });
  }

  async getCarReviews(carId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders/car/${carId}/reviews${query ? `?${query}` : ''}`);
  }

  // Coupons
  async getCoupons() {
    return this.request('/coupons');
  }

  async claimCoupon(couponId) {
    return this.request('/coupons/claim', {
      method: 'POST',
      body: { couponId }
    });
  }

  async validateCoupon(code, amount) {
    return this.request(`/coupons/validate?code=${code}&amount=${amount}`);
  }

  async payWithCoupon(orderId, paymentMethod, couponCode, actualAmount) {
    return this.request(`/orders/${orderId}/pay`, {
      method: 'POST',
      body: { 
        payment_method: paymentMethod,
        coupon_code: couponCode,
        actual_amount: actualAmount
      }
    });
  }

  // Admin coupons
  async getAdminCoupons() {
    return this.request('/coupons/admin');
  }

  async createCoupon(couponData) {
    return this.request('/coupons/admin', {
      method: 'POST',
      body: couponData
    });
  }

  async updateCoupon(id, couponData) {
    return this.request(`/coupons/admin/${id}`, {
      method: 'PUT',
      body: couponData
    });
  }

  async deleteCoupon(id) {
    return this.request(`/coupons/admin/${id}`, {
      method: 'DELETE'
    });
  }

  // Admin users
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }
}

class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const api = new ApiService();
export { ApiError };
