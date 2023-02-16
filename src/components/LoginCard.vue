<template>
  <n-spin :show="isLoggingIn">
    <template #description>
      Logging you in...
    </template>
    <n-card title="Log in" size="large" class="login-card" :closable="closable" @close="cardClosed">
      <n-alert v-if="loginErrorResponse" title="Login Error" type="error" class="login-error">
        {{ loginErrorResponse }}
      </n-alert>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="formRules"
        size="medium"
        @keyup="keyTyped"
      >
        <n-form-item label="Username" path="username">
          <n-input v-model:value="formValue.username" placeholder="" ref="usernameInputRef"/>
        </n-form-item>
        <n-form-item label="Password" path="password">
          <n-input v-model:value="formValue.password" type="password" placeholder=""/>
        </n-form-item>
        <n-form-item>
          <n-button @click="submit" round>
            Log in
          </n-button>
        </n-form-item>
        <n-divider>
          OR
        </n-divider>
        <n-button color="#5865F2" text-color="#ffffff" round @click="redirectToDiscordLogin" class="oauth-button">
          <template #icon>
            <FontAwesomeIcon icon="fab fa-discord" class="oauth-button-icon" />
          </template>
          Log in with Discord
        </n-button>
      </n-form>
    </n-card>
  </n-spin>
</template>

<script setup lang="ts">
import type {FormInst, FormItemRule, FormValidationError} from "naive-ui";
import {NCard, NForm, NFormItem, NInput, NButton, NAlert, NSpin, NDivider} from "naive-ui";
import {ref} from "vue";
import {useMutation} from "@vue/apollo-composable";
import {LoginLocalDocument} from "@/graphql/types";
import {useAuthStore} from "@/stores/auth";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

// Setup references
const formRef = ref<FormInst | null>(null)
const usernameInputRef = ref<typeof NInput | null>(null)
const isLoggingIn = ref<boolean>(false);
const formValue = ref({
  username: "",
  password: ""
})
const loginErrorResponse = ref<string | null>(null);

// Define emits & props
const emit = defineEmits(["success", "close"]);
const props = defineProps(["closable"]);
defineExpose({focus})

// Import composables
const {mutate: login} = useMutation(LoginLocalDocument, () => ({
  variables: {
    username: formValue.value.username,
    password: formValue.value.password
  }
}));
const authStore = useAuthStore();

// Define rules for form input, as well as how to handle incorrect input.
const formRules = {
  username: {
    required: true,
    message: "Please input your username",
    trigger: "blur"
  },
  password: {
    required: true,
    trigger: "blur",
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Please input your password");
      }
      if (value.length < 8) {
        return new Error("Passwords must be at least 8 characters")
      }
      const uniqueChars = new Set(value.split(""));
      if (uniqueChars.size < 5) {
        return new Error("Password must contain at least 5 unique characters");
      }
    }
  }
}

/**
 * Handler for when the "close" button on the NCard is clicked. This button is only visible
 *   when the "closable" prop is set to true.
 */
function cardClosed() {
  emit("close");
}

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
  // Validate the form
  formRef.value?.validate(
    async (errors: Array<FormValidationError> | undefined) => {
      if (!errors) {
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
    }
  )
}

/**
 * Focus the username input of the login card. This method is exposed so parent components
 *   can call it.
 */
function focus() {
  usernameInputRef.value?.focus()
}

function redirectToDiscordLogin() {
  return window.location.href = window.location.protocol + '//' + window.location.host + import.meta.env.BASE_URL + 'api/auth/discord';
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

.oauth-button-icon {
  margin-right: 5px;
}

button {
  width: 100%;
}
</style>
