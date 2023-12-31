<script lang="ts" setup>
  import { XMarkIcon } from "@heroicons/vue/20/solid";

  import useCartStore from "~/stores/cart";
  import useUserStore from "~/stores/user";
  import useNotificationStore from "~/stores/notification";

  const cartStore = useCartStore();
  const userStore = useUserStore();
  const notificationStore = useNotificationStore();

  const { cart, totalItems } = storeToRefs(cartStore);
  const { isLoggedIn } = storeToRefs(userStore);

  const { checkOut } = useOrder();

  const products = computed(() => {
    return cart.value?.CartItem.map((item: any) => {
      return {
        id: item.Product.id,
        itemId: item.id,
        name: item.Product.name,
        price: item.Product.price,
        quantity: item.quantity,
        color: item.Color.name,
        size: item.Size.size,
        imageSrc: item.Product.Images[0].url,
        imageAlt: item.Product.name,
      };
    });
  });

  const total = computed(() => {
    return cart.value?.total;
  });

  async function handleSubmit() {
    if (!isLoggedIn.value) {
      navigateTo("/signin?redirect=/cart");
    } else {
      const { data, error } = await checkOut();

      if (error.value) {
        notificationStore.addNotification({
          id: `${Math.random()}`,
          type: "error",
          message: error.value.message,
          duration: 3000,
        });
        return;
      } else if (data.value) {
        navigateTo(data.value.data.paymentLink, {
          external: true,
        });
      }
    }
  }

  function removeItem(itemId: string) {
    cartStore.removeItemFromCart(itemId);
  }
</script>

<template>
  <div class="bg-white">
    <div
      class="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>
      <form
        class="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        @submit.prevent="handleSubmit"
      >
        <section aria-labelledby="cart-heading" class="lg:col-span-7">
          <h2 id="cart-heading" class="sr-only">Items in your shopping cart</h2>
          <ul
            role="list"
            class="divide-y divide-gray-200 border-b border-t border-gray-200"
          >
            <li
              v-for="product in products"
              :key="product.id"
              class="flex py-6 sm:py-10"
            >
              <div class="flex-shrink-0">
                <img
                  :src="product.imageSrc"
                  :alt="product.imageAlt"
                  class="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                />
              </div>

              <div class="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div
                  class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0"
                >
                  <div>
                    <div class="flex justify-between">
                      <h3 class="text-sm">
                        <nuxt-link
                          :to="`/products/${product.id}`"
                          class="font-medium text-gray-700 hover:text-gray-800"
                          >{{ product.name }}</nuxt-link
                        >
                      </h3>
                    </div>
                    <div class="mt-1 flex text-sm">
                      <p class="text-gray-500">{{ product.color }}</p>
                      <p
                        v-if="product.size"
                        class="ml-4 border-l border-gray-200 pl-4 text-gray-500"
                      >
                        {{ product.size }}
                      </p>
                    </div>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ product.price }}
                    </p>
                  </div>

                  <div class="mt-4 sm:mt-0 sm:pr-9">
                    <p
                      v-if="product.quantity"
                      class="ml-4 border-l border-gray-200 pl-4 text-gray-500"
                    >
                      Quantity {{ product.quantity }}
                    </p>

                    <div class="absolute right-0 top-0">
                      <button
                        type="button"
                        class="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        @click.prevent="removeItem(product.itemId)"
                      >
                        <span class="sr-only">Remove</span>
                        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="summary-heading"
          class="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2 id="summary-heading" class="text-lg font-medium text-gray-900">
            Order summary
          </h2>

          <dl class="mt-6 space-y-4">
            <div
              class="flex items-center justify-between border-t border-gray-200 pt-4"
            >
              <dt class="text-base font-medium text-gray-900">Order total</dt>
              <dd class="text-base font-medium text-gray-900">
                PKR {{ total?.toFixed(2) }}
              </dd>
            </div>
          </dl>

          <div class="mt-6">
            <button
              type="submit"
              class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              :disabled="totalItems == 0"
            >
              Checkout
            </button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>
