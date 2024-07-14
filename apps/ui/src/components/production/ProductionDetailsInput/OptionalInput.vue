<template>
  <v-combobox class="mt-2" clearable chips multiple label="Production Tags (Hit enter if you need to make another tag)"
              :disabled="!ability.can(AbilityActions.Create, AbilitySubjects.ProductionTag)"
              v-model.trim="value" />
  <v-textarea label="Production Description" clearable v-model="modelValue.description"/>
  <v-textarea label="Production Teamnotes" clearable v-model="modelValue.teamNotes" />
</template>

<script setup lang="ts">
import { ability, AbilityActions } from "@/casl";
import { AbilitySubjects } from "@/graphql/types";
import type { Production, ProductionTag } from "@/graphql/types";
import { onMounted, ref, watch, } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<Partial<Production>>,
    required: true
  },
  tags: {
    type: Object as PropType<ProductionTag[]>,
    required: true
  }
});


const emit = defineEmits(["update:modelValue", "update:tags"]);

const value = ref<string[]>([]);

watch(value, () => {
  const newTags: ProductionTag[] = [];
  for (const val of value.value) {
    newTags.push({tag: val});
  }
  emit("update:tags", newTags);
})

onMounted(() => {
  for (const tag of props.tags) {
    value.value.push(tag.tag as string);
  }
})

</script>

<style scoped lang="scss">

</style>
