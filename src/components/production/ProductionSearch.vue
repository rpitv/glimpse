<template>
  <div class="search">
    <v-switch inset true-value="Name" false-value="ID" v-model="model" false-icon="fa-id-card" true-icon="fa-input-text" :ripple="false"/>
    <v-text-field :label="`Search for ${documentName} via ${model}`" append-inner-icon="fa-magnifying-glass"
            @click:append-inner="emit('search', searchVal, model)" @keydown.enter="emit('search', searchVal, model)" :type="model === 'ID' ? 'number' : 'text'"
            variant="outlined" density="compact" v-model="searchVal" style="width: 90%" />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import type {PropType} from "vue"
import { useQuery } from "@vue/apollo-composable";
import type { DocumentParameter, UseQueryReturn } from "@vue/apollo-composable/dist/useQuery";

defineProps({
  documentName : {
    type: String,
    required: true
  },
})

const emit = defineEmits(['search']);

const model = ref("ID");
const searchVal = ref("");
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
