<template>
  <div>
    <div v-if="userId !== null">
      <ChangePasswordCard class="change-password-card" :user-id="BigInt(userId)" />
    </div>
    <div class="loading" v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">

import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";
import ChangePasswordCard from "@/components/user/ChangePasswordForm.vue";

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
