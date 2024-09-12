<template>
  <div>
    <h1>Change Password</h1>

    <v-alert class="popup-msg" v-if="!!error && passwordInput.length > 0" type="error" :text="error"></v-alert>
    <v-alert class="popup-msg" v-if="saveFailed" type="error" text="Failed to change password"></v-alert>
    <v-alert class="popup-msg" v-if="saveSuccess" type="success" text="Password changed"></v-alert>

    <v-row>
      <v-col cols="12" md="6">
        <label>New Password</label>
        <v-text-field type="password" v-model="passwordInput" @keup="inputKeyPressed"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <label>Confirm Password</label>
        <v-text-field type="password" v-model="confirmPasswordInput" @keyup="inputKeyPressed"></v-text-field>
      </v-col>
    </v-row>

    <div class="actions">
      <v-btn class="action-button" color="success" :disabled="!!error" @click="save">Save</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { computed, PropType, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { UpdateUserDocument } from "@/graphql/types";

const mutation = useMutation(UpdateUserDocument);
const message = useMessage();

const passwordInput = ref<string>('');
const confirmPasswordInput = ref<string>('');
const saveSuccess = ref<boolean>(false);
const saveFailed = ref<boolean>(false);

const emit = defineEmits(['save', 'close']);

const props = defineProps({
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
      saveSuccess.value = true;
      passwordInput.value = '';
      confirmPasswordInput.value = '';
    } else {
      console.error(result.errors);
      saveFailed.value = true;
    }

    setTimeout(() => {
      saveSuccess.value = false;
      saveFailed.value = false;
    }, 15000);

  }
  emit('save', passwordInput);
}

</script>

<style scoped lang="scss">
  .popup-msg {
    margin-bottom: 0.5rem;
  }
  .actions {
    display: flex;
    justify-content: right;
  }
</style>
