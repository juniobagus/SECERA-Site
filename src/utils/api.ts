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

export async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
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
  try {
    const response = await fetch(`${API_BASE_URL}/cms/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    return response.ok;
  } catch (error) {
    console.error(`API Error (saveCMSContent ${key}):`, error);
    return false;
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
