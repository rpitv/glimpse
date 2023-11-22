<template>
  <div class="search">
    <v-switch inset true-value="ID" false-value="Name" v-model="model" true-icon="fa-id-card" false-icon="fa-input-text" :ripple="false"/>
    <v-text-field :label="`Search for ${documentName} via ${model}`" append-inner-icon="fa-magnifying-glass"
            @click:append-inner="emit('search', searchVal, model)" @keydown.enter="emit('search', searchVal, model)" :type="model === 'ID' ? 'number' : 'text'"
            variant="outlined" density="compact" v-model="searchVal" style="width: 90%" />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

defineProps({
  documentName : {
    type: String,
    required: true
  },
})

const emit = defineEmits(['search']);

const model = ref("Name");
const searchVal = ref("");
</script>

<style scoped lang="scss">
.search {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
