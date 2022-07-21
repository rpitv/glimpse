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
import {NModal} from "naive-ui";
import {ref} from "vue";

const isLoginShown = ref(false);

function onClick() {
  /* TODO change the action depending on login state */
  isLoginShown.value = !isLoginShown.value;
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
