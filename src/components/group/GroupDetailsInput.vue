<template>
  <n-form ref="formRef" :model="inputGroup" :rules="rules" inline>
    <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
      <n-form-item-grid-item
        path="name"
        label="Name"
        v-if="inputGroup!.name != null"
      >
        <n-input maxlength="50" v-model:value="inputGroup!.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item
        path="priority"
        label="Priority"
        v-if="inputGroup?.priority != null"
      >
        <n-input-number class="form-item" v-model:value="inputGroup.priority" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="parentId" label="Parent">
        <div>
          <GroupSearch
            class="form-item"
            :disabled-groups="data?.id != null ? [{ id: data?.id }] : []"
            @select="parentGroupSelected"
          />
          <n-tag
            v-if="inputGroup!.parent != null"
            closable
            @close="parentGroupSelected(null)"
            type="primary"
            class="parent-group-tag"
          >
            {{ inputGroup!.parent?.name }} (ID {{ inputGroup!.parent?.id }})
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
import { Group } from "@/graphql/types";
import { FormRules } from "naive-ui";
import GroupSearch from "@/components/group/GroupSearch.vue";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Group>>,
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

const inputGroup = computed<Partial<Group>>({
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
          return new Error("Group name is required.");
        } else if (value.length > 50) {
          return new Error("Group name must be 50 characters or less");
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
          return new Error("Parent group ID must be an integer.");
        }
      },
    },
  ],
};

function parentGroupSelected(parent: Pick<Group, "id"> | null) {
  if (!inputGroup.value) {
    throw new Error("Cannot set parent group on null group");
  }
  inputGroup.value.parentId = parent?.id ?? null;
  inputGroup.value.parent = parent ?? null;
}
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-group-tag {
  margin: 1em 0;
}
</style>
