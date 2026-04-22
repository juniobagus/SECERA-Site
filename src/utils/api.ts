const API_URL = import.meta.env.VITE_API_URL;
import { getJwt } from './auth';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('API URL is not defined in environment variables');
  }

  const { token, headers = {}, ...restOptions } = options;
  const url = `${API_URL}${path.startsWith('/') ? path : '/' + path}`;

  const reqHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const authToken = token || getJwt();
  if (authToken) {
    reqHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: reqHeaders,
  });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) return {} as T;

  const text = await response.text();
  if (!text) return {} as T;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return text as unknown as T;
  }
}

// Products
export async function getProducts() {
  try {
    return await fetchApi<any[]>('products');
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    return await fetchApi<any>(`products/${id}`);
  } catch (err) {
    console.error(`Failed to fetch product ${id}:`, err);
    return null;
  }
}

export async function createProduct(productData: any, variants: any[], images: any[]) {
  return await fetchApi('products', {
    method: 'POST',
    body: JSON.stringify({ ...productData, variants, images })
  });
}

export async function updateProduct(id: string, productData: any, variants: any[], images: any[]) {
  return await fetchApi(`products/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...productData, variants, images })
  });
}

export async function deleteProduct(id: string) {
  return await fetchApi(`products/${id}`, {
    method: 'DELETE'
  });
}

// Categories
export async function getCategories() {
  try {
    return await fetchApi<any[]>('categories');
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}

// Orders
export async function getOrders() {
  try {
    return await fetchApi<any[]>('orders');
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return [];
  }
}

export async function createOrder(orderData: any) {
  return await fetchApi('orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

export async function updateOrderStatus(id: string, status: string) {
  console.log('Update order status', id, status);
}

// Admin Stats (Placeholder)
export async function getAdminStats() {
  return {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0
  };
}
