<template>
  <v-form class="form" ref="generalInquiry">
    <v-text-field class="mt-2" label="Enter your full name" v-model="name" :rules="[formRules.name]"/>
    <v-text-field class="mt-2" label="Enter the subject of your inquiry" v-model="subject" :rules="[formRules.subject]"></v-text-field>
    <v-text-field class="mt-2" label="Enter your email" v-model="email" :rules="[formRules.email]"/>
    <v-textarea class="mt-2" label="Type your inquiry" v-model="body" :rules="[formRules.body]"/>
    <v-btn class="mt-5 text-caption" color="green-accent-4" @click="submitGeneralInq" :disabled="loading">Submit</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable"
import { CreateContactSubmissionGeneralDocument} from "@/graphql/types";
import { ref, defineEmits } from "vue";
import { VForm } from "vuetify/components";

const emit = defineEmits(['submit', 'missing']);

const createGeneralInquiry = useMutation(CreateContactSubmissionGeneralDocument);

const name = ref("");
const subject = ref("");
const email = ref("");
const body = ref("");
const loading = ref(false);
const generalInquiry = ref<VForm>();


const formRules = {
  name: (value: string) => {
    if (value?.length > 100) return "Name can not be more than 100 characters";
    if (value?.length > 0) return true;
    return "Name can not be empty"
  },
  email: (value: string) => {
    if (value?.length === 0) return "Email can not be empty";
    if (value?.length > 300) return "Email can not be more than 300 characters";
    // Regex expression to check for a valid email address
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim.test(value))
      return true;
    return "Email address is not valid";
  },
  subject: (value: string) => {
    if (value?.length > 100) return "The event name must be less than 100 characters long";
    if (value?.length >= 5) return true;
    return "The subject should be at least 5 characters long.";
  },
  body: (value: string) => {
    if (value?.length > 1000) return "The inquiry must be less than 1000 characters long.";
    if (value?.length >= 15) return true;
    return "The inquiry must be at least 15 characters long.";
  },
}

async function submitGeneralInq() {
  const validation = await generalInquiry.value?.validate();
  if (!validation?.valid) {
    emit('missing');
    return;
  }
  loading.value = true;
  try {
    const submission = await createGeneralInquiry.mutate({
      data: {
        name: name.value,
        body: body.value,
        email: email.value,
        subject: subject.value,
      }
    });
    emit('submit');
  } catch (e) {
    console.error(e);
  }
  loading.value = false;
}

</script>

<style scoped lang="scss">

</style>
