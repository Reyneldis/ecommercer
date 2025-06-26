import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  productName: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: data => {
        console.log('Añadiendo item al carrito:', data);
        const currentItems = get().items;
        console.log('Items actuales:', currentItems);

        const existingItem = currentItems.find(i => i.slug === data.slug);
        console.log('Item existente:', existingItem);

        if (existingItem) {
          toast.error('El producto ya esta en el carrito');
          return;
        } else {
          const newItem = { ...data, quantity: 1 };
          console.log('Añadiendo nuevo item:', newItem);
          set({ items: [...currentItems, newItem] });
          toast.success('Producto añadido correctamente al carrito');
        }
      },
      removeItem: (slug: string) => {
        const currentItems = get().items;
        set({ items: currentItems.filter(item => item.slug !== slug) });
        toast.success('Producto eliminado del carrito');
      },
      updateQuantity: (slug: string, quantity: number) => {
        const currentItems = get().items;
        set({
          items: currentItems.map(item =>
            item.slug === slug ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
        toast.success('Carrito vaciado');
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
