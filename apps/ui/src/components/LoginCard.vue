<template>
  <v-card title="Log In" class="login-card" >
    <v-card-text>
      <v-alert v-if="loginErrorResponse" title="Login Error" type="error" class="login-error">
        {{ loginErrorResponse }}
      </v-alert>
      <div class="d-flex flex-row justify-center">
        <v-progress-circular indeterminate color="error" class="progress" :class="{show: isLoggingIn, hide: !isLoggingIn}" size="150">
          <p>Logging you in...</p>
        </v-progress-circular>
      </div>
      <div :class="{hide: isLoggingIn, show: !isLoggingIn}">
        <v-form @keyup="keyTyped" ref="formRef">
          <v-text-field v-model="formValue.username" label="Username" :focused="true" :rules="usernameRules" required variant="outlined"/>
          <v-text-field v-model="formValue.password" label="Password" type="password" :rules="passwordRules" required variant="outlined"/>
          <v-btn @click="submit" rounded class="text-caption" variant="outlined">Log In</v-btn>
        </v-form>
        <br>
        <v-row class="align-center">
          <v-col cols="5">
            <v-divider />
          </v-col>
          <v-col cols="2">
            <p style="text-align: center">OR</p>
          </v-col>
          <v-col cols="5">
            <v-divider />
          </v-col>
        </v-row>
        <br>
        <a :href="loginWithDiscordLink">
          <v-btn color="#5865F2" text-color="#ffffff" rounded class="oauth-button text-caption">
            <FontAwesomeIcon icon="fab fa-discord" class="oauth-button-icon" />
            Log in with Discord
          </v-btn>
        </a>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {useMutation} from "@vue/apollo-composable";
import {LoginLocalDocument} from "@/graphql/types";
import {useAuthStore} from "@/stores/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { useRoute } from "vue-router";
import type { VForm } from "vuetify/components";

const route = useRoute();
// Setup references
const formRef = ref<VForm>(null);
const isLoggingIn = ref<boolean>(false);
const formValue = ref({
  username: "",
  password: ""
})

const loginErrorResponse = ref<string | null>(null);

// Define emits & props
const emit = defineEmits(["success", "close"]);
const props = defineProps({
  closable: {
    type: Boolean,
    default: false
  },
  redirect: {
    type: String,
    default: null
  }
});
defineExpose({focus});

const loginWithDiscordLink = computed<string>(() => {
  const url = window.location.protocol + '//' + window.location.host + import.meta.env.BASE_URL + 'api/auth/discord';
  if(props.redirect) {
    return url + '?redirect=' + props.redirect;
  } else {
    return url;
  }
});

watch(() => route.query, () => {
  if(route.name === "login" && route.query.error) {
    if(route.query.error === "no_user") {
      loginErrorResponse.value = "No user for that account was found.";
    } else if(route.query.error === "invalid_code") {
      loginErrorResponse.value = "Invalid response from Discord. Please try again.";
    } else if(route.query.error === "server_error") {
      loginErrorResponse.value = "An error occurred while logging you in. Please try again.";
    } else {
      loginErrorResponse.value = "An unknown error occurred while logging you in. Please try again.";
    }
  }
}, {immediate: true});

// Import composables
const {mutate: login} = useMutation(LoginLocalDocument, () => ({
  variables: {
    username: formValue.value.username,
    password: formValue.value.password
  }
}));
const authStore = useAuthStore();

// Define rules for form input, as well as how to handle incorrect input.
const usernameRules = [
  (value: string) => {
    if (value) return true;
    return "Please input your username";
  },
]

const passwordRules = [
  (value: string) => {
    if (!value)
      return "Please input your password";
    if (value.length < 8)
      return "Passwords must be at least 8 characters";
    const uniqueChars = new Set(value.split(""));
    if (uniqueChars.size < 5)
      return "Password must contain at least 5 unique characters";
    return true;
  }
]

/**
 * Called whenever a key is pressed anywhere in the form. This is used to detect the enter key,
 *   and subsequently submit the form.
 * @param e The key event
 */
async function keyTyped(e: KeyboardEvent) {
  if (e.key === "Enter") {
    await submit()
  }
}

/**
 * Submit the form to the GraphQL API. Also update the UI to show the loading state, and redirect
 *   the user/show login errors, depending on login success.
 */
async function submit() {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;
  // If form validation found no errors, then attempt to log in.
  // Show spinner and hide any error messages from previous login attempts
  isLoggingIn.value = true;
  loginErrorResponse.value = null;
  // Send login request to GraphQL API
  try {
    const result = await login();
    // If login was successful, then emit success. Otherwise, show an unknown error message (should never happen).
    if (result?.data?.loginLocal?.id) {
      emit("success");
      authStore.isLoggedIn = true;
      authStore.permissions = null;
      authStore.userId = undefined;
      await authStore.getOwnId();
      await authStore.getPermissions();
    } else {
      loginErrorResponse.value = "Login failed. Please try again.";
    }
  } catch (e: any) {
    // If there were any issues with the login input (e.g. wrong username/password), then show an error message.
    if (e.message) {
      loginErrorResponse.value = e.message;
    } else {
      loginErrorResponse.value = "Unknown error. Please contact an administrator.";
      console.error(e);
    }
  }
  // Hide the spinner, as login request has completed.
  isLoggingIn.value = false;
}

</script>

<style scoped lang="scss">
.login-card {
  @media(min-width: 440px) {
    width: 350px;
    margin-left: calc(50% - 350px / 2)
  }
}

.login-error {
  margin-bottom: 20px;
}
.oauth-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.oauth-button-icon {
  margin-top: 2%;
  margin-right: 5px;
}
a {
  text-decoration: none !important;
}

button {
  width: 100%;
}

.progress {
  position: absolute;
  margin-top: 10%;
}

.hide {
  opacity: 0;
  transition: 1s;
}
.show {
  opacity: 1;
  transition: 1s;
}

.test {
  display: flex;
  align-items: center;
}
</style>
