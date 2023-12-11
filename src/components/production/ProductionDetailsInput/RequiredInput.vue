<template>
  <v-text-field class="mt-1" variant="outlined" label="Production Name" density="compact"
                required :rules="nameRules" v-model="modelValue.name"/>
  <div class="second-row">
    <v-text-field class="mt-1 input" variant="outlined" label="Closet Location" :rules="closetLocRules" density="compact"
                  required v-model="modelValue.closetLocation"/>
    <v-text-field class="mt-1 input" variant="outlined" label="Event Location" :rules="eventLocRules" density="compact"
                  required v-model="modelValue.eventLocation"
    />
  </div>
  <div class="center">
    <div class="date-time-container">
      <div>
        <div class="center">
          <p>Closet Time</p>
        </div>
        <div class="center">
          <div :class="{missing: closetTimeMissing}">
            <DatePicker v-model="modelValue.closetTime" mode="dateTime" :is-dark="true" :rules="rules" />
          </div>
        </div>
      </div>
      <div>
        <div class="center">
          <p>Start Time</p>
        </div>
        <div class="center">
          <div :class="{missing: startTimeMissing}" class="calendar">
            <DatePicker v-model="modelValue.startTime" mode="dateTime" :is-dark="true" :rules="rules"/>
          </div>
        </div>
      </div>
      <div>
        <div class="center">
          <p>End Time</p>
        </div>
        <div class="center">
          <div :class="{missing: endTimeMissing}">
            <DatePicker v-model="modelValue.endTime" mode="dateTime" :is-dark="true" :rules="rules"/>
          </div>
        </div>
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

const rules =  {
  minutes: {
    interval: 15
  }
}

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
  @media (max-width: 1020px) {
    flex-direction: column;
  }
}

.date-time-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  @media (max-width: 1020px) {
    flex-direction: column;
  }
}

.input {
  max-width: 45%;
  @media (max-width: 1020px) {
    max-width: 100%;
  }
}

.center {
  display: flex;
  justify-content: space-around;
}
</style>
