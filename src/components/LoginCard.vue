<template>
<n-card title="Login" size="large">
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="formRules"
    size="medium"
    @keyup="keyTyped"
  >
    <n-form-item label="Username" path="username">
      <n-input v-model:value="formValue.username" placeholder="" />
    </n-form-item>
    <n-form-item label="Password" path="password">
      <n-input v-model:value="formValue.password" type="password" placeholder="" />
    </n-form-item>
    <n-form-item>
      <n-button @click="submitted">
        Login
      </n-button>
    </n-form-item>
  </n-form>
</n-card>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule, FormValidationError } from "naive-ui";
import { NCard, NForm, NFormItem, NInput, NButton } from "naive-ui";
import { ref } from "vue";



const formRef = ref<FormInst | null>(null)

const formValue = ref({
  username: "",
  password: ""
})

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
      if(!value) {
        return new Error("Please input your password");
      }
      if(value.length < 8) {
        return new Error("Passwords must be at least 8 characters")
      }
    }
  }
}

async function keyTyped(e: KeyboardEvent) {
  if(e.key === "Enter") {
    await submitted()
  }
}

async function submitted() {
  formRef.value?.validate(
    async (errors: Array<FormValidationError> | undefined) => {
      if (!errors) {
        await login(formValue.value.username, formValue.value.password);
      } else {
        console.error(errors)
      }
    }
  )
}

async function login(username: string, password: string) {
  console.log(username, password);
}
</script>

<style scoped lang="scss">

</style>
