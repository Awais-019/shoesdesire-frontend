import useCartStore from "~/stores/cart";
import useUserStore from "~/stores/user";

export const useOrder = () => {
  const { baseURL } = useRuntimeConfig().public;

  function checkOut() {
    const { orderItems } = useCartStore();
    const { token } = useUserStore();

    return useFetch<{
      message: string;
      data: {
        paymentLink: string;
      };
    }>("/orders", {
      method: "POST",
      headers: {
        "x-auth-token": token || "",
      },
      baseURL,
      body: {
        items: orderItems,
      },
    });
  }

  function updatePaymentStatus(orderId: string) {
    const { token } = useUserStore();

    return $fetch<{
      message: string;
    }>(`/orders/${orderId}`, {
      method: "POST",
      headers: {
        "x-auth-token": token || "",
      },
      baseURL,
    });
  }

  return {
    checkOut,
    updatePaymentStatus,
  };
};
