<template>
<div>
  <StaticBackground />
  <n-result
    status="500"
    title="System Error"
    :description="errorMessage"
    size="huge"
  >
    <template #icon>
      <FontAwesomeIcon icon="fa-duotone fa-user-robot-xmarks" class="icon" />
    </template>
    <template #footer>
      <p>Please contact an administrator or try again later.</p>
    </template>
  </n-result>
</div>
</template>

<script setup lang="ts">
import StaticBackground from "@/components/StaticBackground.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {NResult} from "naive-ui";
import {computed, PropType, Ref} from "vue";

const props = defineProps({
  error: {
    type: Object as PropType<Error>,
  },
})

const errorMessage: Ref<string> = computed(() => {
  if(props.error) {
    return `Error: ${props.error.message}`;
  } else {
    return "An unknown error has occurred.";
  }
})

</script>

<style scoped lang="scss">
.icon {
  --fa-primary-color: #f4fbff;
  --fa-secondary-color: #ff6363;
  --fa-secondary-opacity: 1.0;
  font-size: 10em;
}
div {
  padding-top: 5vw;
}
a {
  text-decoration: none;
}
.buttons-row {
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    margin-right: 5px;
  }
  padding-bottom: 15px;
}
</style>
