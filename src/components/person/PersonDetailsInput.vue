<template>
  <n-form ref="formRef" :model="inputPerson" :rules="rules" inline>
    <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
      <n-form-item-grid-item
        path="name"
        label="Name"
        v-if="inputPerson!.name != null"
      >
        <n-input maxlength="100" v-model:value="inputPerson!.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="pronouns" label="Pronouns">
        <n-auto-complete
          :value="inputPerson.pronouns || ''"
          @update:value="updatePronouns"
          maxlength="20"
          :options="pronounOptions"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="graduation" label="Graduation">
        <n-date-picker type="date" v-model:value="computedGraduation" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="description" label="Description" span="3">
        <n-input
          type="textarea"
          class="form-item"
          maxlength="1000"
          :value="inputPerson.description || ''"
          @update:value="inputPerson.description = $event"
        />
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
  NAutoComplete,
  NDatePicker,
} from "naive-ui";
import { computed, PropType, ref, watch } from "vue";
import { Person } from "@/graphql/types";
import { FormRules } from "naive-ui";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Person>>,
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

const inputPerson = computed<Partial<Person>>({
  get() {
    return props.data;
  },
  set(value) {
    emit("update:data", value);
  },
});

const computedGraduation = computed<number | null>({
  get() {
    return inputPerson.value.graduation
      ? new Date(inputPerson.value.graduation).getTime()
      : null;
  },
  set(value) {
    inputPerson.value.graduation = value ? new Date(value).toISOString() : null;
  },
});

const pronounOptions = computed(() => {
  return ["he/him", "she/her", "they/them"];
});

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (!value) {
          return new Error("Person name is required.");
        } else if (value.length > 100) {
          return new Error("Person name must be 100 characters or less");
        }
      },
    },
  ],
  pronouns: [
    {
      required: false,
      trigger: "change",
      validator(rule, value) {
        if (value?.length > 20) {
          return new Error("Person pronouns must be 20 characters or less");
        }
      },
    },
  ],
};

function updatePronouns(value: string) {
  inputPerson.value.pronouns = value.toLowerCase().replace(" ", "");
}
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-person-tag {
  margin: 1em 0;
}
</style>
