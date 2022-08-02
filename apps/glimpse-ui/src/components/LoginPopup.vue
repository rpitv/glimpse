<template>
  <n-modal v-model:show="isPopupShown">
    <div class="login-card">
      <LoginCard ref="loginCardRef"
                 :closable="true"
                 @success="isPopupShown = false"
                 @close="isPopupShown = false"/>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import LoginCard from "@/components/LoginCard.vue";
import {NModal} from "naive-ui";
import {computed, nextTick, ref, watch} from "vue";
const loginCardRef = ref<LoginCard | null>(null);

// Setup v-model prop/emit
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:modelValue']);

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

// Focus the username input box when the popup is shown.
watch(() => isPopupShown.value, () => {
  if(isPopupShown.value) {
    nextTick(() => {
      loginCardRef.value?.focus();
    })
  }
});

</script>

<style scoped lang="scss">
.login-card {
  width: 60%;
}
</style>
