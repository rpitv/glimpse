<template>
  <v-row class="mt-2">
    <v-col cols="4">
      <v-text-field :rules="[nameRule]" density="compact" variant="outlined" label="Name *" v-model="personData.name" />
    </v-col>
    <v-col cols="4">
      <v-combobox :rules="[pronounsRule]" :items="['he/him', 'she/her', 'they/them']" density="compact" variant="outlined" label="Pronouns" v-model="personData.pronouns" />
    </v-col>
    <v-col cols="3">
      <v-date-input density="compact" variant="outlined" label="Graduation"
        prepend-icon="" prepend-inner-icon="$calendar" clearable v-model="personData.graduation" />
    </v-col>
  </v-row>
  <v-textarea label="Description" v-model="personData.description" />
  * = required
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { PropType } from "vue";
import type {Person} from "@/graphql/types";

const props = defineProps({
  personData: {
    type: Object as PropType<Partial<Person>>,
    required: true
  }
})

const nameRule = () => {
  if (!props.personData.name)
    return "Name is required";
  else if (props.personData.name.length > 100)
    return "Name must be 8 characters or less";
  return true;
}

const pronounsRule = () => {
  if (!props.personData.pronouns)
    return true;
  if (props.personData.pronouns.length > 20)
    return "Pronouns must be 20 characters or less";
  return true;
}


</script>

<style scoped lang="scss">

</style>
