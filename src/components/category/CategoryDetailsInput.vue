<template>
  <n-form ref="formRef" :model="inputCategory" :rules="rules" inline>
    <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
      <n-form-item-grid-item
        path="name"
        label="Name"
        v-if="inputCategory!.name != null"
      >
        <n-input maxlength="50" v-model:value="inputCategory!.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item
        path="priority"
        label="Priority"
        v-if="inputCategory?.priority != null"
      >
        <n-input-number
          class="form-item"
          v-model:value="inputCategory.priority"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="parentId" label="Parent">
        <div>
          <CategorySearch
            class="form-item"
            :disabled-categories="data?.id != null ? [{ id: data?.id }] : []"
            @select="parentCategorySelected"
          />
          <n-tag
            v-if="inputCategory!.parent != null"
            closable
            @close="parentCategorySelected(null)"
            type="primary"
            class="parent-category-tag"
          >
            {{ inputCategory!.parent?.name }} (ID
            {{ inputCategory!.parent?.id }})
          </n-tag>
          <p v-else>None</p>
        </div>
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
  NTag,
  NInputNumber,
} from "naive-ui";
import { computed, PropType, ref, watch } from "vue";
import { Category } from "@/graphql/types";
import { FormRules } from "naive-ui";
import CategorySearch from "@/components/category/CategorySearch.vue";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Category>>,
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

const inputCategory = computed<Partial<Category>>({
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
          return new Error("Category name is required.");
        } else if (value.length > 50) {
          return new Error("Category name must be 50 characters or less");
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
  parentId: [
    {
      trigger: "change",
      validator(rule, value) {
        if (value == null) {
          return;
        }
        if (typeof value === "string") {
          value = parseInt(value);
        }
        if (!Number.isInteger(value) && typeof value !== "bigint") {
          return new Error("Parent category ID must be an integer.");
        }
      },
    },
  ],
};

function parentCategorySelected(parent: Pick<Category, "id"> | null) {
  if (!inputCategory.value) {
    throw new Error("Cannot set parent category on null category");
  }
  inputCategory.value.parentId = parent?.id ?? null;
  inputCategory.value.parent = parent ?? null;
}
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-category-tag {
  margin: 1em 0;
}
</style>
