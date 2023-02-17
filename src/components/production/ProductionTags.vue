<template>
  <NButton text @click="show = !show" style="font-size: 16px; font-family: 'Oswald', sans-serif;">
    <span :class="{show: show, notShow: !show}" style="font-size: 12px">&#xfe40;</span>&nbsp;Tags
  </NButton>
  <hr class="divider">
  <NCollapseTransition :show="show">
    <NSpace>
      <NButton v-for="tag in props.tags" :key="tag" color="#426779" style="color: #68b0d4" size="tiny">
        {{ tag }}
      </NButton>
    </NSpace>
  </NCollapseTransition>
</template>

<script setup lang="ts">
import type {PropType} from "vue";
import {ref} from "vue";
import {NCollapseTransition, NButton, NSpace} from "naive-ui"

const show = ref<boolean>(false);

const props = defineProps({
  tags: {
    type: Array as PropType<string[]>,
    required: true
  }
});
</script>

<style scoped>
.divider {
  border-top: 2px;
}
.notShow {
  font-weight: bold;
  transition-duration: 0.25s;
  transform: rotate(-90deg);
}
.show {
  font-weight: bold;
  transition-duration: 0.25s;
  transform: rotate(0deg);
}
</style>
