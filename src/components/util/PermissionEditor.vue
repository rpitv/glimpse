<template>
  <div>
    <h2>Description</h2>
    <PermissionDescription  class="permissions-editor-description-text" :permission="localPermission" />
  </div>
  <div>
    <h2>Edit</h2>
    <n-grid cols="1 s:2" responsive="screen" x-gap="10" y-gap="10">
      <n-grid-item>
        <div class="input-item">
          <label>Action</label>
          <n-select v-model:value="localPermission.action" :options="actionItems" />
        </div>

        <div class="input-item">
          <label>Subjects</label>
          <n-select v-model:value="localPermission.subject" multiple :options="subjectItems" />
        </div>

        <div class="input-item">
          <label>Fields</label>
          <n-dynamic-tags v-model:value="localPermission.fields" />
        </div>

        <n-alert  v-if="localPermission.inverted" :span="2" type="warning">Inverted permissions are generally not recommended, as they have different effects
          depending on the order in which permissions are applied.
          <a href="https://github.com/rpitv/glimpse-api/wiki/CASL-Integration#inverted" target="_blank">
            See the wiki for more information.
          </a>
        </n-alert>

        <div class="input-item">
          <label>Inverted</label>
          <div>
            <n-switch v-model:value="localPermission.inverted" />
          </div>
        </div>

        <div v-if="localPermission.inverted" class="input-item">
          <label>Inverted Reason</label>
          <n-input v-model:value="localPermission.reason" />
        </div>

      </n-grid-item>
      <n-grid-item>
        <label>Conditions</label>
        <ConditionsEditor v-model:value="localPermission.conditions" />
      </n-grid-item>
    </n-grid>
    <div class="actions">
      <n-button type="error" @click="emit('delete')">
        Delete Permission
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NSelect, NSwitch, NInput, NAlert, NButton, NDynamicTags } from "naive-ui";
import type { Permission } from "@/graphql/types";
import type { PropType } from "vue";
import PermissionDescription from "@/components/util/PermissionDescription.vue";
import { computed } from "vue";
import { AbilityActions } from "@/casl";
import { AbilitySubjects } from "@/graphql/types";
import ConditionsEditor from "@/components/util/ConditionsEditor.vue";

const props = defineProps({
  permission: {
    type: Object as PropType<Permission>,
    required: true
  },
});

const emit = defineEmits(["update:permission", "delete"]);

const localPermission = computed<Permission>({
  get() {
    return props.permission;
  },
  set(value) {
    emit("update:permission", value);
  }
});

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

const conditionsJson = computed<string>({
  get() {
    return JSON.stringify(localPermission.value.conditions, null, 2);
  },
  set(value) {
    try {
      localPermission.value.conditions = JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
  }
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
.actions {
  display: flex;
  justify-content: flex-end;
  margin: 1em 0;
}

label {
  display: block;
  margin-bottom: 0.25em;
}

.input-item {
  margin: 1em 0;
}
</style>
