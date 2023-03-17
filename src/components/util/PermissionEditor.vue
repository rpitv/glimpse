<template>
  <div>
    <h2>Description</h2>
    <PermissionDescription  class="permissions-editor-description-text" :permission="permission" />
  </div>
  <div>
    <h2>Edit</h2>
  </div>
</template>

<script setup lang="ts">
import type { Permission } from "@/graphql/types";
import type { PropType } from "vue";
import PermissionDescription from "@/components/util/PermissionDescription.vue";

const props = defineProps({
  permission: {
    type: Object as PropType<Permission>,
    required: true
  },
})



</script>

<style lang="scss">
// WARNING! This is non-scoped SCSS. Look below for scoped.
.permissions-editor-description-text {
  padding-left: 1em;
  border-left: 3px solid rgba(140, 140, 140, 0.5);

  & > * {
    font-size: 1.15em;

    * {
      margin: 0;
    }

    code {
      background-color: #2c2c2c;
      padding: 0.2em 0.4em;
      border-radius: 0.2em;
    }
  }
}
// WARNING! This is non-scoped SCSS. Look below for scoped.
</style>

<style scoped lang="scss">

</style>
