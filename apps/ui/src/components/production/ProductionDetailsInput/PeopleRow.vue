<template>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Credit } from "@/graphql/types";

const titles = ["Cameraman", "Director", "Graphics Operator", "Producer"];

defineProps({
  creditPeople: {
    type: Object as PropType<Credit[]>,
    required: true
  }
})

const emit = defineEmits(["assignTitle"]);

function assignTitle(title: string, index: number) {
  console.log(index);
  emit("assignTitle", title, index);
}

</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
  align-items: center;
}

.dialog-card {
  display: flex;
  justify-content: center;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

</style>
