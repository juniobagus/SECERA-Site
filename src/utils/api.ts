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
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
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
