import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type CartProduct = {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  image: string;
  variant: string;
};

type CartLine = CartProduct & { quantity: number };

type CartContextValue = {
  items: CartLine[];
  totalItems: number;
  addItem: (item: CartProduct) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const getNumericPrice = (price: string) => Number(price.replace(/[^\d]/g, "")) || 0;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const addItem = (item: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const incrementItem = (id: number) => {
    setItems((prev) =>
      prev.map((line) => (line.id === id ? { ...line, quantity: line.quantity + 1 } : line))
    );
  };

  const decrementItem = (id: number) => {
    setItems((prev) =>
      prev
        .map((line) => (line.id === id ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0)
    );
  };

  const totalItems = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, totalItems, addItem, incrementItem, decrementItem }),
    [items, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function calculateLineTotal(price: string, quantity: number) {
  return getNumericPrice(price) * quantity;
}
