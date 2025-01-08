<template>
  <n-form ref="formRef" :model="inputUser" :rules="rules" inline>
    <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
      <n-form-item-grid-item path="username" label="Username">
        <n-input maxlength="8" v-model:value="inputUser.username" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="mail" label="Email">
        <n-input maxlength="300" v-model:value="inputUser.mail" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="discord" label="Discord ID">
        <n-input minlength="18" maxlength="32" v-model:value="inputUser.discord" />
      </n-form-item-grid-item>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { NForm, NGrid, NFormItemGridItem, NInput, FormInst } from "naive-ui";
import { computed, PropType, ref, watch } from "vue";
import { User } from "@/graphql/types";
import { FormRules } from "naive-ui";
import validator from "validator";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<User>>,
    required: true,
  }
});

const emit = defineEmits(['update:data']);

const isValid = ref<boolean>(false);
const formRef = ref<FormInst|null>(null);
defineExpose({
  isValid
})

watch([props, props.data, formRef], async () => {
  if(formRef.value) {
    try {
      await formRef.value.validate();
      isValid.value = true;
      return;
    } catch(e) {}
  }
  isValid.value = false;
}, { deep: true, flush: "post" })

const inputUser = computed({
  get() {
    return props.data;
  },
  set(value) {
    emit('update:data', value);
  }
});


const rules: FormRules = {
  username: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if(!value) {
          return new Error("Username is required.");
        }else if(value.length > 8) {
          return new Error("Username must be 8 characters or less");
        }
      },
    }
  ],
  mail: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if(!value) {
          return new Error("Email is required.");
        } else if(!validator.isEmail(value)) {
          return new Error("Email is not valid.");
        } else if(value.length > 300) {
          return new Error("Email must be 300 characters or less");
        }
      }
    }
  ],
  discord: [
    {
      trigger: "change",
      validator(rule, value) {
        if(!value) {
          return;
        }
        if(!validator.isNumeric(value) || value.length < 18 || value.length > 32) {
          return new Error("Discord IDs must be 18-32 digits long.");
        }
      }
    }
  ]
};
</script>

<style scoped lang="scss">

</style>
