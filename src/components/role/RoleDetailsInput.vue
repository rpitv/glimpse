<template>
  <n-form ref="formRef" :model="inputRole" :rules="rules" inline>
    <n-grid cols="1 m:2" responsive="screen" x-gap="10" y-gap="10">
      <n-form-item-grid-item
        path="name"
        label="Name"
        v-if="inputRole!.name != null"
      >
        <n-input maxlength="50" v-model:value="inputRole!.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item
        path="priority"
        label="Priority"
        v-if="inputRole?.priority != null"
      >
        <n-input-number class="form-item" v-model:value="inputRole.priority" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="description" label="Description" span="2">
        <n-input
          type="textarea"
          class="form-item"
          maxlength="1000"
          v-model:value="inputRole.description"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item
        v-if="inputRole.displayInMembership != null"
        path="displayInMembership"
        label="Display in Membership"
      >
        <n-switch v-model:value="inputRole.displayInMembership" />
      </n-form-item-grid-item>
      <n-form-item-grid-item
        v-if="inputRole.displayInLeadership != null"
        path="displayInLeadership"
        label="Display in Leadership"
      >
        <n-switch v-model:value="inputRole.displayInLeadership" />
      </n-form-item-grid-item>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import {
  NForm,
  NGrid,
  NFormItemGridItem,
  NInput,
  FormInst,
  NInputNumber,
  NSwitch,
} from "naive-ui";
import { computed, PropType, ref, watch } from "vue";
import { Role } from "@/graphql/types";
import { FormRules } from "naive-ui";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Role>>,
    required: true,
  },
});

const emit = defineEmits(["update:data"]);

const isValid = ref<boolean>(false);
const formRef = ref<FormInst | null>(null);
defineExpose({
  isValid,
});

watch(
  [props, props.data, formRef],
  async () => {
    if (formRef.value) {
      try {
        await formRef.value.validate();
        isValid.value = true;
        return;
      } catch (e) {}
    }
    isValid.value = false;
  },
  { deep: true, flush: "post" }
);

const inputRole = computed<Partial<Role>>({
  get() {
    return props.data;
  },
  set(value) {
    emit("update:data", value);
  },
});

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (!value) {
          return new Error("Role name is required.");
        } else if (value.length > 100) {
          return new Error("Role name must be 100 characters or less");
        }
      },
    },
  ],
  description: [
    {
      required: false,
      trigger: "change",
      validator(rule, value) {
        if (value?.length > 1000) {
          return new Error("Role description must be 1,000 characters or less");
        }
      },
    },
  ],
  priority: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (isNaN(value)) {
          return new Error("Priority is required.");
        } else if (!Number.isInteger(value) && typeof value !== "bigint") {
          return new Error("Priority must be an integer.");
        }
      },
    },
  ],
};
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-role-tag {
  margin: 1em 0;
}
</style>
