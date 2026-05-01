const API_BASE_URL = '/api';

export interface Order {
  id: string;
  total_amount: number;
  shipping_cost: number;
  discount_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  notes?: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('API Error (getOrders):', error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order detail');
    return await response.json();
  } catch (error) {
    console.error('API Error (getOrderById):', error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch (error) {
    console.error('API Error (updateOrderStatus):', error);
    return false;
  }
}

export async function getProducts(status?: string) {
  try {
    const url = status ? `${API_BASE_URL}/products?status=${status}` : `${API_BASE_URL}/products`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('API Error (getProducts):', error);
    return [];
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('API Error (getCategories):', error);
    return [];
  }
}

export async function createCategory(name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Failed to create category');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (createCategory):', error);
    throw error;
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
  } catch (error) {
    console.error('API Error (updateCategory):', error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('API Error (deleteCategory):', error);
    return false;
  }
}

export async function getProductById(productId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error('API Error (getProductById):', error);
    return null;
  }
}

export async function createProduct(productData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (createProduct):', error);
    throw error;
  }
}

export async function updateProduct(productId: string, productData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (updateProduct):', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('API Error (deleteProduct):', error);
    return false;
  }
}

export async function createOrder(orderData: any, items: any[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...orderData, items }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return { success: true };
  } catch (error) {
    console.error('API Error (createOrder):', error);
    throw error;
  }
}

export async function getCMSContent(key: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/${key}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`API Error (getCMSContent ${key}):`, error);
    return null;
  }
}

export async function saveCMSContent(key: string, content: any) {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const parseRetryAfterMs = (value: string | null) => {
    if (!value) return null;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds) * 1000;
    const dateMs = Date.parse(value);
    if (!Number.isNaN(dateMs)) return Math.max(0, dateMs - Date.now());
    return null;
  };

  const globalAny = globalThis as any;
  const inflight: Map<string, Promise<boolean>> =
    globalAny.__seceraInflightCmsSaves ?? (globalAny.__seceraInflightCmsSaves = new Map());
  const lastSaveAt: Map<string, number> =
    globalAny.__seceraLastCmsSaveAt ?? (globalAny.__seceraLastCmsSaveAt = new Map());

  const existing = inflight.get(key);
  if (existing) return existing;

  const now = Date.now();
  const last = lastSaveAt.get(key) ?? 0;
  // Prevent accidental double-submits / hot-refresh storms.
  if (now - last < 1500) {
    console.warn(`saveCMSContent(${key}) skipped: called too frequently.`);
    return false;
  }

  const task = (async () => {
    lastSaveAt.set(key, Date.now());

    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/cms/${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(content),
        });

        if (response.ok) return true;
        if (response.status !== 429) return false;

        if (attempt === maxAttempts) return false;

        const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
        const backoffMs = Math.min(8000, 500 * 2 ** (attempt - 1));
        const jitterMs = Math.floor(Math.random() * 250);
        await sleep((retryAfterMs ?? backoffMs) + jitterMs);
      } catch (error) {
        console.error(`API Error (saveCMSContent ${key}):`, error);
        return false;
      }
    }

    return false;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}
export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    }
    return null;
  } catch (error) {
    console.error('API Error (uploadImage):', error);
    return null;
  }
}

export async function uploadVideo(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await fetch(`${API_BASE_URL}/uploads/video`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    }
    return null;
  } catch (error) {
    console.error('API Error (uploadVideo):', error);
    return null;
  }
}

// === Settings ===

export async function getSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('API Error (getSettings):', error);
    return {};
  }
}

export async function updateSettings(settings: Record<string, any>) {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
  } catch (error) {
    console.error('API Error (updateSettings):', error);
    throw error;
  }
}

// === Shipping (RajaOngkir) ===

export async function searchDestination(query: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search');
    return await response.json();
  } catch (error) {
    console.error('API Error (searchDestination):', error);
    return [];
  }
}

export async function getShippingCost(origin: string | number, destination: string | number, weight: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/shipping/cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, weight, courier: 'jnt' }),
    });
    if (!response.ok) throw new Error('Failed to calculate shipping cost');
    return await response.json();
  } catch (error) {
    console.error('API Error (getShippingCost):', error);
    return [];
  }
}

// === Customer Auth ===

export async function customerLogin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return { ok: response.ok, data: await response.json() };
}

export async function customerRegister(email: string, password: string, name: string, phone?: string) {
  const response = await fetch(`${API_BASE_URL}/customer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name, phone }),
  });
  return { ok: response.ok, data: await response.json() };
}

export async function updateProfile(profileData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  } catch (error) {
    console.error('API Error (updateProfile):', error);
    throw error;
  }
}

// === Order Tracking ===

export async function getMyOrders() {
  try {
    const token = localStorage.getItem('customer_token');
    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('API Error (getMyOrders):', error);
    return [];
  }
}

export async function lookupGuestOrder(orderId: string, phone: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/lookup?order_id=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
    if (!response.ok) {
      const err = await response.json();
      return { success: false, message: err.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error (lookupGuestOrder):', error);
    return { success: false, message: 'Koneksi gagal' };
  }
}
// === Customers (CRM) ===

export async function getCustomers() {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
  } catch (error) {
    console.error('API Error (getCustomers):', error);
    return [];
  }
}

export async function getCustomerByPhone(phone: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${phone}`);
    if (!response.ok) throw new Error('Failed to fetch customer details');
    return await response.json();
  } catch (error) {
    console.error('API Error (getCustomerByPhone):', error);
    return null;
  }
}
