<template>
  <div class="container">
    <LoginCard @success="loginSuccess" />
  </div>
</template>

<script setup lang="ts">
import LoginCard from "@/components/LoginCard.vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

async function loginSuccess() {
  if(route.query.redirect) {
    await router.push(route.query.redirect.toString());
  } else {
    await router.push("/");
  }
}
</script>

<style scoped lang="scss">
  .container {
    margin-top: 3em;
  }
</style>
