<template>
  <v-text-field class="mt-1" variant="outlined" label="Production Name" density="compact"
                required :rules="nameRules" v-model="modelValue.name"/>
  <div class="second-row">
    <v-text-field class="mt-1" variant="outlined" label="Closet Location" :rules="closetLocRules" density="compact"
                  required style="max-width: 45%" v-model="modelValue.closetLocation"/>
    <v-text-field class="mt-1" variant="outlined" label="Event Location" :rules="eventLocRules" density="compact"
                  required style="max-width: 45%" v-model="modelValue.eventLocation"
    />
  </div>
  <div class="date-time-container">
    <div>
      <p>Closet Time</p>
      <div :class="{missing: closetTimeMissing}">
        <DatePicker v-model="modelValue.closetTime" mode="dateTime" :is-dark="true"  />
      </div>
    </div>
    <div>
      <p>Start Time</p>
      <div :class="{missing: startTimeMissing}" class="calendar">
        <DatePicker v-model="modelValue.startTime" mode="dateTime" :is-dark="true" />
      </div>
    </div>
    <div>
      <p>End Time</p>
      <div :class="{missing: endTimeMissing}">
        <DatePicker v-model="modelValue.endTime" mode="dateTime" :is-dark="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DatePicker} from "v-calendar";
import type { Production } from "@/graphql/types"
import type { PropType } from "vue";

defineProps({
  modelValue: {
    type: Object as PropType<Partial<Production>>,
    required: true
  },
  closetTimeMissing: {
    type: Boolean,
    required: true
  },
  startTimeMissing: {
    type: Boolean,
    required: true
  },
  endTimeMissing: {
    type: Boolean,
    required: true
  }
})

defineEmits(["update:modelValue"]);

/*
  The variable is required because vue doesn't like it
  in the template...
 */
const nameRules = [
  (v: string) => !!v || 'Production name is required'
];

const closetLocRules = [
  (v: string) => !!v || 'Closet Location is required'
]

const eventLocRules = [
  (v: string) => !!v || 'Event Location is required'
]

</script>

<style scoped lang="scss">
.missing {
  border-style: solid;
  border-radius: 2.5%;
  border-width: 1px;
  border-color: #FF1744;
}

.second-row {
  display: flex;
  justify-content: space-between;
}

.date-time-container {
  display: flex;
  justify-content: space-around;
  font-size: 20px;
}
</style>
