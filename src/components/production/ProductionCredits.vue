<template>
  <div v-if="sortedCredits.length > 0">
    <h3>Credits</h3>
    <n-grid :cols="3">
      <n-grid-item v-for="credit in sortedCredits" :key="credit.id" class="col">
        <span class="no-display-at-1250">&ensp; </span>
        <span class="name">&nbsp;{{ credit.person.name }}</span>
        <span class="no-display-at-1250"> - </span>
        <span class="title">{{ credit.title }}</span>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import type {PropType} from "vue";
import type {Credit} from "@/graphql/types";
import {NGrid, NGridItem} from "naive-ui";
import {computed} from "vue";

const props = defineProps({
  credits: {
    type: Array as PropType<Pick<Credit, "__typename" | "title" | "priority" | "person" | "id">[]>,
    required: true
  }
});

const sortedCredits = computed(() => {
  return [...props.credits].sort((a, b) => b.priority - a.priority);
});

</script>

<style scoped>
.profile-icon {
  border-radius: 50%;
  display: inline;
  vertical-align: middle;
}
.name {
  font-weight: bold;
}
.col {
  padding: 5px;
}
@media screen and (max-width: 1250px) {
  .col {
    text-align: center;
  }
  .name {
    display: block;
  }
  .no-display-at-1250 {
    display: none;
  }
}
</style>
