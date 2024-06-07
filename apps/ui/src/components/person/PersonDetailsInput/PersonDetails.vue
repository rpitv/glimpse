<template>
  <v-row class="mt-2">
    <v-col cols="4">
      <v-text-field density="compact" variant="outlined" label="Name*" v-model="personData.name" />
    </v-col>
    <v-col cols="4">
      <v-combobox :items="['he/him', 'she/her', 'they/them']" density="compact" variant="outlined" label="Pronouns" v-model="personData.pronouns" />
    </v-col>
    <v-col cols="3">
      <v-date-input density="compact" variant="outlined" label="Graduation" prepend-icon="" prepend-inner-icon="$calendar" v-model="personData.graduation" />
    </v-col>
  </v-row>
  <v-textarea variant="outlined" label="Description" v-model="personData.description" />
  * = required
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { PropType } from "vue";
import type {Person} from "@/graphql/types";

defineProps({
  personData: {
    type: Object as PropType<Partial<Person>>,
    required: true
  }
})

</script>

<style scoped lang="scss">

</style>
