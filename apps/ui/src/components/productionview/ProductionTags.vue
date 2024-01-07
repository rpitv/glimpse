<template>
  <div class="tag-container">
    <div class="mt-3 mr-3 tag" v-for="tag in props.tags" :key="tag" style="color: #68b0d4">
      {{ tag }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type {PropType} from "vue";

const props = defineProps({
  tags: {
    type: Array as PropType<string[]>,
    required: true
  }
});
</script>

<style scoped>

.tag-container {
  display: flex;
  flex-wrap: wrap
}

.tag {
  width: fit-content;
  background-color: #426779;
  border-radius: 5px;
  padding: 3px;
  text-align: center;
}
</style>
