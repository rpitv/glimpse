<template>
  <n-modal v-model:show="isLoginShown">
    <div class="login-card">
    <LoginCard @success="loginSuccess" @close="loginClose" :closable="true" />
    </div>
  </n-modal>
  <div @click="onClick">
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
import LoginCard from "@/components/LoginCard.vue";
import {NModal, useMessage} from "naive-ui";
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth";
import {logout} from "@/logout";

const isLoginShown = ref(false);

const authStore = useAuthStore();
const message = useMessage();

async function onClick() {
  if(authStore.isLoggedIn) {
    try {
      await logout();
      authStore.permissions = null;
      authStore.userId = null;
      await authStore.getPermissions();
    } catch(e: any) {
      console.error(e);
      if(e.message) {
        message.error(e.message);
      } else {
        message.error(e);
      }
      return;
    }
    message.success("Logged out successfully");
  } else {
    isLoginShown.value = true;
  }
}

function loginSuccess() {
  isLoginShown.value = false;
}

function loginClose() {
  isLoginShown.value = false;
}

</script>

<style scoped lang="scss">
.login-card {
  width: 60%;
}
</style>
