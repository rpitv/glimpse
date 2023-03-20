<template>
  <div>
    <div v-for="condition of conditionInputs" class="condition">
      <ConditionEditor :condition="condition" />
    </div>

    <label>Add Condition</label>
    <ConditionEditor :condition="newCondition" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed, ref } from "vue";
import type { ConditionInput } from "@/util";
import ConditionEditor from "@/components/util/ConditionEditor.vue";

const props = defineProps({
  value: {
    type: Object as PropType<Record<string, Record<string, unknown>>>,
    required: true
  }
});

const newCondition = ref<ConditionInput>({
  type: 'string',
  valueIsVariable: false,
  field: '',
  operator: '',
  value: null
});

const conditionInputs = computed<ConditionInput[]>(() => {
  const result: ConditionInput[] = [];
  for(const field in props.value) {
    for(const operator in props.value[field]) {
      let value = props.value[field][operator];
      let type: 'string' | 'number' | 'boolean' | 'date';
      if(typeof value === 'string') {
        type = 'string';
      } else if (typeof value === 'bigint') {
        type = 'number';
        value = Number(value);
      } else if(typeof value === 'number') {
        type = 'number';
      } else if(typeof value === 'boolean') {
        type = 'boolean';
      } else if(value instanceof Date) {
        type = 'date';
      } else {
        throw new Error('Unknown type');
      }
      result.push({
        type,
        valueIsVariable: typeof value === "string" && value.startsWith("$"),
        field: field,
        operator: operator,
        value
      });
    }
  }
  return result;
});

const emit = defineEmits(['update:value']);
</script>

<style scoped lang="scss">
  .condition {
    margin: 0.25em 0;
  }
</style>
