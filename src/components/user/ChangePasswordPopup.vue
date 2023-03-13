<template>
<n-modal v-model:show="isPopupShown" class="modal">
  <ChangePasswordCard
    :closable="true"
    :user-id="userId"
    @close="isPopupShown = false"
    @save="emit('save', $event); isPopupShown = false"
  />
</n-modal>
</template>

<script setup lang="ts">
import { NModal } from "naive-ui";
import ChangePasswordCard from "@/components/user/ChangePasswordCard.vue";
import { computed, PropType } from "vue";

// Setup v-model prop/emit
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  }
})
const emit = defineEmits(['update:modelValue', 'save']);

// Wrap prop in a computed property to emit an event when it's set, pushing the responsibility of
//   updating the prop to the parent component.
const isPopupShown = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

</script>

<style scoped lang="scss">
  .modal {
    width: min(400px, 80%)
  }
</style>
