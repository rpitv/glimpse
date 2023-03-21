<template>
  <div>
    <!-- The NaiveUI textarea component element appears to not properly expose scroll height -->
    <textarea
      ref="input"
      class="conditions-input"
      v-model="valueAsJson"
      @change="validateInput"
      spellcheck="false"
    />
    <n-alert v-if="inputError" type="error"><Markdown>{{ inputError }}</Markdown></n-alert>
  </div>
</template>

<script setup lang="ts">
import { NInput, NAlert } from "naive-ui";
import type { PropType } from "vue";
import { nextTick, ref, watch } from "vue";
import Markdown from "@/components/util/Markdown.vue";

const props = defineProps({
  value: {
    type: Object as PropType<Record<string, Record<string, unknown>>>,
    required: true
  }
});

const emit = defineEmits(['update:value']);

const inputError = ref<string | null>(null);
const input = ref<typeof NInput | null>(null);

// We store the value as a string, and then when the user blurs the input, we validate the JSON and update the
//  prop value if it is valid.
const valueAsJson = ref<string>('');
watch(props, () => {
  valueAsJson.value = JSON.stringify(props.value, null, 4);
}, { immediate: true });

function validateInput() {
  inputError.value = null;
  try {
    const obj = JSON.parse(valueAsJson.value);
    validateConditionSyntax(obj);
    emit('update:value', obj);
  } catch(e) {
    if(!(e instanceof Error)) {
      console.error(e);
      inputError.value = 'Unknown error';
      return;
    }

    // noinspection SuspiciousTypeOfGuard -- validateConditionSyntax throws an Error, not a SyntaxError
    if(e instanceof SyntaxError) {
      inputError.value = 'Invalid JSON: ' + e.message;
    } else {
      inputError.value = e.message;
    }
  }
}

/**
 * Validates the syntax of a condition object. Throws an error if the condition is invalid. Returns void if the
 *  condition is valid.
 * @param condition Condition value to check the syntax of.
 * @throws Error if the condition is not a valid condition object
 */
function validateConditionSyntax(condition: unknown): void {
  if(typeof condition !== 'object' || condition === null) {
    throw new Error('Condition must be an object');
  }

  for(const [fieldKey, fieldValue] of Object.entries(condition)) {
    if(['AND', 'OR', 'NOT'].includes(fieldKey)) {
      validateConditionSyntax(fieldValue);
      continue;
    }

    for(const [opKey, opValue] of Object.entries(fieldValue)) {
      console.log(opKey, opValue);
      validateOperatorValue(opKey, opValue);
    }
  }
}

type OperatorValues = 'string' | 'number' | 'boolean' | 'date' | 'string[]' | 'number[]' | 'null';
const variableTypes: Record<string, OperatorValues> = {
  "$id": "number",
  "$groups": "number[]",
  "$now": "date"
}
const operators: Record<string, OperatorValues[]> = {
  equals: ['string', 'number', 'boolean', 'date', 'null'],
  not: ['string', 'number', 'boolean', 'date', 'null'],
  gt: ['number', 'date'],
  gte: ['number', 'date'],
  lt: ['number', 'date'],
  lte: ['number', 'date'],
  in: ['string[]', 'number[]'],
  contains: ['string'],
  startsWith: ['string'],
  endsWith: ['string']
}

/**
 * Checks whether the given value can be used with the given operator. If not, an error is thrown. Otherwise, void is
 *  returned. For example, the 'in' operator can only be used with string and number arrays, so if the value is a
 *  boolean, an error is thrown.
 * @param operator
 * @param value
 * @see operators for where it is defined which operators can be used with which value types
 */
function validateOperatorValue(operator: string, value: unknown) {
  if(operator === "mode") {
    if(value !== "Insensitive" && value !== "Default") {
      throw new Error("`mode` must be either \"Insensitive\" or \"Default\"");
    }
  }
  if(operators[operator] === undefined) {
    throw new Error(`Unknown operator: \`${operator}\``);
  }

  let valueType: string;
  if(Array.isArray(value)) {
    if(value.length === 0) {
      throw new Error('Arrays cannot be empty');
    }
    const firstValueType = typeof value[0];
    if(firstValueType !== 'string' && firstValueType !== 'number') {
      throw new Error('Arrays can only contain strings or numbers');
    }
    for(const v of value) {
      if(typeof v !== firstValueType) {
        throw new Error('Arrays must contain all the same type of value');
      }
    }
    valueType = firstValueType + '[]';
  } else if(value === null) {
    valueType = 'null';
  } else {
    valueType = typeof value;
    if(valueType === 'string') {
      if(!isNaN(new Date(value as string).getTime())) {
        valueType = 'date';
      } else if((value as string).startsWith('$')) {
        valueType = variableTypes[value as string];
        if(valueType === undefined) {
          throw new Error(`Unknown variable: \`${value}\``);
        }
      }
    }
  }

  if(!operators[operator].includes(valueType as any)) {
    throw new Error(`Operator \`${operator}\` cannot be used with value of type \`${valueType}\``);
  }
}

// Resize the textarea to fit the content. Height is set to initial to allow the textarea to shrink, so we can properly
//  calculate the scroll height. Without this, if lines are removed, the text area will not shrink (in fact, it will
//  grow by 4px).
const inputHeight = ref<string>('100px');
watch([input, valueAsJson], () => {
  inputHeight.value = 'initial';
  nextTick(() => {
    const height = Math.max(100, input.value?.scrollHeight);
    inputHeight.value = `${height + 4}px`;
  })
}, { immediate: true });

</script>

<style scoped lang="scss">
  .conditions-input {
    height: v-bind(inputHeight);
    width: 100%;
    resize: none;
    background-color: rgb(35, 35, 40);
    color: white;
  }
</style>
