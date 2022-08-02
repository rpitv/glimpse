<template>
<div>
  <StaticBackground />
  <LoginPopup v-model="showLoginPopup"/>
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

        <RouterLink to="/login" v-if="!authStore.isLoggedIn" custom v-slot="{href, navigate}">
          <a :href="href"
             :aria-current="route.name === 'login' ? 'page' : null"
             @click="loginClicked($event, navigate)"
          >
            <n-button>Login</n-button>
          </a>
        </RouterLink>
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
import LoginPopup from "@/components/LoginPopup.vue";
import {Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {shouldOpenInNewTab} from "@/util/helper";

const authStore = useAuthStore();
const route = useRoute();

const showLoginPopup: Ref<boolean> = ref(false);

function loginClicked(event: MouseEvent, navigate: (event: MouseEvent) => void) {
  if(shouldOpenInNewTab(event)) {
    return navigate(event);
  } else {
    event.preventDefault();
    showLoginPopup.value = true;
  }
}
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
