import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  sku: string;
  productId: string;
  productName: string;
  color: string;
  option: string;
  price: number;
  promoPrice?: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { sku: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.sku === action.payload.sku);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.sku === action.payload.sku
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.sku !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.sku !== action.payload.sku) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.sku === action.payload.sku ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    default:
      return state;
  }
}

const CART_STORAGE_KEY = 'secera-cart';

function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCart(),
    isOpen: false,
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + (i.promoPrice ?? i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (sku) => dispatch({ type: 'REMOVE_ITEM', payload: sku }),
        updateQuantity: (sku, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', payload: { sku, quantity } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        setCartOpen: (open) => dispatch({ type: 'SET_CART_OPEN', payload: open }),
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
