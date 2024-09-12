<template>
<div></div>
</template>

<script setup lang="ts">

import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";

const auth = useAuthStore();

const userId = ref<number|null>(null);
onMounted(async () => {
  userId.value = await auth.getOwnId();
})

</script>

<style scoped lang="scss">
  .change-password-section {
    display: flex;
    justify-content: center;

    .change-password-card {
      width: min(500px, 90vw);
    }
  }

  .loading {
    text-align: center;
  }
</style>
