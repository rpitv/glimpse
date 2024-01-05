<template>
  <n-card>
    <h1>Change Password</h1>

    <n-alert class="error-msg" v-if="!!error && passwordInput.length > 0" type="error">
      {{ error }}
    </n-alert>

    <div class="input-section">
      <label>New Password</label>
      <n-input type="password" v-model:value="passwordInput" @keup="inputKeyPressed"></n-input>
    </div>
    <div class="input-section">
      <label>Confirm Password</label>
      <n-input type="password" v-model:value="confirmPasswordInput" @keyup="inputKeyPressed"></n-input>
    </div>

    <div class="actions">
      <n-button class="action-button" type="success" :disabled="!!error" @click="save">Save</n-button>
      <n-button v-if="closable" class="action-button" type="error" @click="emit('close')">Cancel</n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NInput, NButton, NAlert, useMessage } from "naive-ui";
import { computed, PropType, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { UpdateUserDocument } from "@/graphql/types";

const mutation = useMutation(UpdateUserDocument);
const message = useMessage();

const passwordInput = ref<string>('');
const confirmPasswordInput = ref<string>('');

const emit = defineEmits(['save', 'close']);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false
  },
  userId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  }
});

const error = computed(() => {
  if(passwordInput.value !== confirmPasswordInput.value) {
    return 'Passwords do not match';
  }
  if(passwordInput.value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
});

function inputKeyPressed(event: KeyboardEvent) {
  if (event.key === 'Enter' && !error.value) {
    save();
  }
}

async function save() {
  if(props.userId) {
    const result = await mutation.mutate({
      id: props.userId,
      data: {
        password: passwordInput.value
      }
    })
    if(!result?.errors?.length) {
      message.success('Password changed');
      passwordInput.value = '';
      confirmPasswordInput.value = '';
    } else {
      console.error(result.errors);
      message.error('Failed to change password');
    }

  }
  emit('save', passwordInput);
}

</script>

<style scoped lang="scss">
  .error-msg {
    margin-bottom: 0.5rem;
  }
  .input-section {
    margin-bottom: 0.5rem;
    label {
      display: block;
      margin-bottom: 0.25rem;
    }
  }
  .actions {
    display: flex;
    justify-content: right;
    .action-button {
      margin-top: 0.5rem;
      margin-left: 0.5rem;
    }
  }
</style>
