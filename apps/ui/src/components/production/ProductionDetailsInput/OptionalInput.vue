<template>
  <v-combobox class="mt-2" clearable chips multiple label="Production Tags (Hit enter if you need to make another tag)"
              :disabled="!ability.can(AbilityActions.Create, AbilitySubjects.ProductionTag)"
              variant="outlined" v-model="value" />
  <v-textarea variant="outlined" label="Production Description" clearable v-model="modelValue.description"/>
  <v-textarea variant="outlined" label="Production Teamnotes" clearable v-model="modelValue.teamNotes" />
</template>

<script setup lang="ts">
import {ability, AbilityActions} from "@/casl";
import {AbilitySubjects, Production} from "@/graphql/types";
import {PropType, watch, ref} from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<Partial<Production>>,
    required: true
  },
  tags: {
    type: Object as PropType<Array<string>>,
    required: true
  }
});

const emit = defineEmits(["update:modelValue", "update:tags"]);

const value = ref<string[]>(props.tags);

watch(value, () => {
  let newTags = value.value.map((val) => val.trim());
  if (new Set(newTags).size !== newTags.length)
    newTags = Array.from(new Set(newTags));
  emit("update:tags", newTags);
})

</script>

<style scoped lang="scss">

</style>
