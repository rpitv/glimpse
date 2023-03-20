<template>
 <n-card>
   <div class="condition-settings">
     <n-radio-group v-model:value="condition.type">
       <n-radio v-for="type of types" :key="type.value" :label="type.label" :value="type.value" />
     </n-radio-group>
     <n-switch v-model:value="condition.valueIsVariable" @update-value="condition.value = null">
       <template #checked>
         Variable
       </template>
       <template #unchecked>
         Value
       </template>
     </n-switch>
   </div>

   <n-input-group>
     <n-input v-model:value="condition.field" placeholder="Field Name" />
     <n-select v-model:value="condition.operator" :options="operators[condition.type]" />
   </n-input-group>

   <div class="value-section">
     <div v-if="condition.valueIsVariable">
       <n-select v-model:value="condition.value" :options="variables" />
     </div>
     <div v-else>
       <n-input v-if="condition.type === 'string'" v-model:value="sanitizedStringValue" placeholder="Value" />
       <n-date-picker  v-if="condition.type === 'date'" type="datetime" />
     </div>
   </div>

   <n-button aria-label="Delete" secondary type="error"><FontAwesomeIcon icon="fa-light fa-xmark" /></n-button>
   <n-button aria-label="Add" secondary type="success"><FontAwesomeIcon icon="fa-light fa-plus" /></n-button>
 </n-card>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NCard, NSelect, NInput, NInputGroup, NDatePicker, NRadioGroup, NRadio, NButton, NSwitch } from "naive-ui";
import type { ConditionInput } from "@/util";
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  condition: {
    type: Object as PropType<ConditionInput>,
    required: true
  }
});

const emit = defineEmits(["update:condition", "delete"]);

// Wrapper for condition prop to auto-emit on changes
const localCondition = computed<ConditionInput>({
  get() {
    return props.condition;
  },
  set(newValue) {
    emit("update:condition", newValue);
  }
})

// List of valid condition values, i.e. the types which we have GraphQL comparison inputs for
const types = [
  {label: 'String', value: 'string'},
  {label: 'Number', value: 'number'},
  {label: 'Boolean', value: 'boolean'},
  {label: 'Date', value: 'date'},
]

// List of valid operators for each type of condition value
const operators = {
  'string': [
    {label: '==', value: 'equals'},
    {label: '!=', value: 'not'},
    {label: 'in', value: 'in'},
    {label: 'contains', value: 'contains'},
    {label: 'starts with', value: 'startsWith'},
    {label: 'ends with', value: 'endsWith'},
  ],
  'number': [
    {label: '==', value: 'equals'},
    {label: '!=', value: 'not'},
    {label: '>', value: 'gt'},
    {label: '>=', value: 'gte'},
    {label: '<', value: 'lt'},
    {label: '<=', value: 'lte'},
    {label: 'in', value: 'in'},
  ],
  'date': [
    {label: '==', value: 'equals'},
    {label: '!=', value: 'not'},
    {label: '>', value: 'gt'},
    {label: '>=', value: 'gte'},
    {label: '<', value: 'lt'},
    {label: '<=', value: 'lte'},
  ],
  'boolean': [
    {label: '==', value: 'equals'},
  ]
}

const variables = [
  {label: "The user's ID", value: "$id"},
  {label: "The user's group IDs", value: "$groups"},
  {label: "The current time", value: "$now"}
];

// If a user wants to use variables, they should use the toggle switch and select the variable from the
//  dropdown. The API allows for escaping variables by prefixing them with a backslash. This computed
//  property will automatically add/remove the backslash for string inputs.
const sanitizedStringValue = computed<string>({
  get() {
    if(localCondition.value.value === null) {
      return '';
    }
    if(typeof localCondition.value.value !== 'string') {
      throw new Error('Condition value is not a string');
    }
    // If the value starts with an escaped $, remove the escape
    if(localCondition.value.value.startsWith('\\$')) {
      return localCondition.value.value.substring(1);
    }
    return localCondition.value.value;
  },
  set(newValue: string) {
    // If the new value starts with a $, escape it
    if(newValue.startsWith('$')) {
      localCondition.value.value = '\\' + newValue;
    }
  }
})
</script>

<style scoped lang="scss">
  .condition-settings {
    display: flex;
    justify-content: space-between;
    padding: 1em;
  }
  .value-section {
    margin-top: 1em;
  }
</style>
