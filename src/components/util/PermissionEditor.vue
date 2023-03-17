<template>
  <div>
    <h2>Description</h2>
    <PermissionDescription  class="permissions-editor-description-text" :permission="localPermission" />
  </div>
  <div>
    <h2>Edit</h2>
    <n-grid cols="1 s:2" responsive="screen" x-gap="10" y-gap="10">
      <n-grid-item>
        <label>Action</label>
        <n-select v-model:value="localPermission.action" :options="actionItems" />
      </n-grid-item>
      <n-grid-item>
        <label>Subjects</label>
        <n-select v-model:value="localPermission.subject" multiple :options="subjectItems" />
      </n-grid-item>
      <n-grid-item>
        <label>Fields</label>
      </n-grid-item>
      <n-grid-item>
        <label>Conditions</label>
      </n-grid-item>
      <n-grid-item v-if="localPermission.inverted" :span="2">
        <n-alert type="warning">Inverted permissions are generally not recommended, as they have different effects
          depending on the order in which permissions are applied.
          <a href="https://github.com/rpitv/glimpse-api/wiki/CASL-Integration#inverted" target="_blank">
            See the wiki for more information.
          </a>
        </n-alert>
      </n-grid-item>
      <n-grid-item>
        <n-checkbox v-model:checked="localPermission.inverted">
          Inverted
        </n-checkbox>
      </n-grid-item>
      <n-grid-item v-if="localPermission.inverted">
        <label>Inverted Reason</label>
        <n-input v-model:value="localPermission.reason" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NSelect, NCheckbox, NInput, NAlert } from "naive-ui";
import type { Permission } from "@/graphql/types";
import type { PropType } from "vue";
import PermissionDescription from "@/components/util/PermissionDescription.vue";
import { computed, ref, watch } from "vue";
import { AbilityActions } from "@/casl";
import { AbilitySubjects } from "@/graphql/types";

const props = defineProps({
  permission: {
    type: Object as PropType<Permission>,
    required: true
  },
});

const localPermission = ref<Permission>({...props.permission});
watch(props, () => {
  localPermission.value = {...props.permission}
})

const actionItems = computed(() => {
  return Object.entries(AbilityActions).map(([key, value]) => {
    return {
      label: key,
      value: value
    }
  })
})

const subjectItems = computed(() => {
  return Object.entries(AbilitySubjects).map(([key, value]) => {
    return {
      label: formatSubject(key),
      value: value
    }
  })
})

function formatSubject(subject: string) {
  // Split on capital letters, except for consecutive capital letters
  return subject.replace(/([A-Z][a-z]+)|([A-Z]{2,})/g, " $1$2").trim();
}

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
