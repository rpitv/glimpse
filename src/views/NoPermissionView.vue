<template>
<div>
  <StaticBackground />
  <n-result
    status="403"
    title="Insufficient Permissions"
    description="You do not have permission to access this page."
    size="huge"
  >
    <template #icon>
      <FontAwesomeIcon icon="fa-duotone fa-do-not-enter" class="icon" />
    </template>
    <template #footer>
      <div class="buttons-row">
        <a @click="$router.back()">
          <n-button>Go Back</n-button>
        </a>
        <RouterLink to="/">
          <n-button>Go Home</n-button>
        </RouterLink>
        <LoginLogoutPopupButton v-if="!authStore.isLoggedIn">
          <n-button>Login</n-button>
        </LoginLogoutPopupButton>
      </div>
    </template>
  </n-result>
</div>
</template>

<script setup lang="ts">
import StaticBackground from "@/components/StaticBackground.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {NResult, NButton} from "naive-ui";
import {useAuthStore} from "@/stores/auth";
import LoginLogoutPopupButton from "@/components/LoginLogoutPopupButton.vue";

const authStore = useAuthStore();
</script>

<style scoped lang="scss">
.icon {
  --fa-primary-color: #ff6363;
  --fa-secondary-color: #f4fbff;
  --fa-secondary-opacity: 1.0;
  font-size: 10em;
}
div {
  padding-top: 5vw;
}
a {
  text-decoration: none;
}
.buttons-row {
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    margin-right: 5px;
  }
  padding-bottom: 15px;
}
</style>
