<script lang="ts" setup>
  import useMessageStore from "~/stores/message";
  import useUserStore from "~/stores/user";

  import { reset } from "@formkit/core";

  const { conversation } = storeToRefs(useMessageStore());
  const { user } = storeToRefs(useUserStore());

  const { $socket } = useNuxtApp();

  const formId = "message-form";

  function handleSendMessage(values: any) {
    if (!conversation.value) return;
    $socket.emit("message", {
      conversationId: conversation.value.id,
      message: values.message,
      sender: user.value?.id,
    });
    reset(formId);
  }
</script>

<template>
  <FormKit
    type="form"
    :actions="false"
    form-class="relative border-t border-[#EBEBEB]"
    @submit="handleSendMessage"
  >
    <FormKit
      type="text"
      input-class="w-full border-none focus:ring-0 p-5 rounded-b-2xl"
      name="message"
      placeholder="Type your message"
      validation="required"
      autocomplete="off"
      :id="formId"
    />
    <button type="submit" class="absolute right-2 top-1/3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.47452 2.405C3.34466 2.36734 3.20703 2.36549 3.07621 2.39963C2.94538 2.43378 2.82622 2.50266 2.73133 2.59898C2.63644 2.69531 2.56936 2.81549 2.53718 2.94681C2.505 3.07814 2.50892 3.21572 2.54852 3.345L4.98052 11.25H13.4965C13.6954 11.25 13.8862 11.329 14.0268 11.4697C14.1675 11.6103 14.2465 11.8011 14.2465 12C14.2465 12.1989 14.1675 12.3897 14.0268 12.5303C13.8862 12.671 13.6954 12.75 13.4965 12.75H4.98052L2.54852 20.655C2.50892 20.7843 2.505 20.9219 2.53718 21.0532C2.56936 21.1845 2.63644 21.3047 2.73133 21.401C2.82622 21.4973 2.94538 21.5662 3.07621 21.6004C3.20703 21.6345 3.34466 21.6327 3.47452 21.595C10.0895 19.6713 16.3274 16.6323 21.9195 12.609C22.0162 12.5395 22.0949 12.4481 22.1492 12.3422C22.2035 12.2363 22.2318 12.119 22.2318 12C22.2318 11.881 22.2035 11.7637 22.1492 11.6578C22.0949 11.5519 22.0162 11.4605 21.9195 11.391C16.3275 7.36765 10.0895 4.32865 3.47452 2.405Z"
          fill="#3047EC"
        />
      </svg>
    </button>
  </FormKit>
</template>

<style scoped></style>
