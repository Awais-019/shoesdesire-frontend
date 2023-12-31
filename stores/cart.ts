type Cart = {
  id: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  CartItem: CartItem[];
};

type CartItem = {
  id: string;
  quantity: number;
  Product: {
    id: string;
    name: string;
    price: number;
    Images: { url: string }[];
  };
  Size: {
    id: string;
    size: number;
  };
  Color: {
    id: string;
    name: string;
    hex: string;
  };
};

export default defineStore(
  "cart",
  () => {
    const cartId = ref("");
    const cart = ref<Cart | null>(null);

    const { create, addToCart, get, removeCartItem } = useCart();

    async function addProductToCart(
      productId: string,
      quantity: number,
      sizeId: string,
      colorId: string
    ) {
      if (!cartId.value) {
        const { data } = await create();
        cartId.value = data.value?.data.id ?? "";
        await addToCart(cartId.value, productId, quantity, sizeId, colorId);
      } else if (cartId) {
        await addToCart(cartId.value, productId, quantity, sizeId, colorId);
      }
      await getCart();
    }

    async function getCart() {
      if (!cartId.value) {
        return;
      }

      const { data } = await get(cartId.value);

      cart.value = data.value?.data ?? null;
    }

    async function removeItemFromCart(cartItemId: string) {
      if (!cartId.value) {
        return;
      }

      await removeCartItem(cartId.value, cartItemId);
      await getCart();
    }

    const totalItems = computed(() => {
      if (!cart.value) {
        return 0;
      }

      return cart.value.CartItem.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);
    });

    const orderItems = computed(() => {
      if (!cart.value) {
        return [];
      }
      return cart.value.CartItem.map((item) => {
        return {
          productId: item.Product.id,
          quantity: item.quantity,
          sizeId: item.Size.id,
          colorId: item.Color.id,
        };
      });
    });

    function $resetStore() {
      cartId.value = "";
      cart.value = null;
    }

    return {
      cartId,
      cart,
      totalItems,
      orderItems,
      addProductToCart,
      getCart,
      removeItemFromCart,
      $resetStore,
    };
  },
  {
    persist: true,
  }
);
