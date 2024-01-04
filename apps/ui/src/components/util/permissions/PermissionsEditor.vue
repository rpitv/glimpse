<template>
  <div>
    <n-card class="card" :style="creator ? 'max-height: 55vh' : ''">
      <div class="intro">
        <h1>Permissions Editor</h1>
        <n-alert type="warning">
          Make sure you know what you're doing before editing permissions! You
          should read
          <a
            href="https://github.com/rpitv/glimpse-api/wiki/CASL-Integration"
            target="_blank"
          >
            the Glimpse wiki article on CASL
          </a>
          before doing anything.
        </n-alert>
      </div>
      <div v-if="editedPermissionActionSubject === null">
        <div class="table-wrapper">
          <n-table class="naive-table">
            <thead class="table-header">
              <tr>
                <th class="subject-col">Subject</th>
                <th v-for="action of reorderedActions" :key="action">
                  {{ formatAction(action) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject of subjects" :key="subject">
                <td class="subject-col">{{ formatSubject(subject) }}</td>
                <td v-for="action of reorderedActions">
                  <component :is="genButtonComponent(action, subject)" />
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>
        <div class="actions">
          <n-button
            v-if="saveRequired"
            class="action"
            type="success"
            @click="save"
            >Save</n-button
          >
          <n-button
            v-if="closable"
            class="action"
            type="error"
            @click="closeButtonClicked"
            >Close</n-button
          >
        </div>
      </div>
      <div v-else>
        <div v-for="permission of permissionsToEdit" :key="permission.id">
          <h2 class="permission-title">
            {{
              permission.id
                ? `Permission ID ${permission.id}`
                : "New Permission"
            }}
          </h2>
          <PermissionEditor
            :permission="permission"
            @delete="removePermission(permission)"
          />
          <hr />
        </div>
        <div class="actions">
          <n-button class="action" @click="addNewPermission" primary type="info"
            >Add Permission</n-button
          >
          <n-button
            class="action"
            @click="editedPermissionActionSubject = null"
            type="error"
            >Back</n-button
          >
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NCard, NTable, NButton, NBadge, useDialog } from "naive-ui";
import type { Permission } from "@/graphql/types";
import type { PropType, VNode } from "vue";
import { AbilityActions } from "@/casl";
import { AbilitySubjects } from "@/graphql/types";
import { computed, h, ref, watch } from "vue";
import PermissionEditor from "@/components/util/permissions/PermissionEditor.vue";
import { useEventListener } from "@vueuse/core";

const buttonTypes = {
  Yes: "success",
  No: "error",
  Partial: "warning",
};

const dialog = useDialog();
const actions = AbilityActions;
const subjects = Object.values(AbilitySubjects) as AbilitySubjects[];
// The actions enum is ordered in a way that makes sense for developers, but not for users.
// This reorders the actions to that the "read" action is first and the "manage" action is last.
const reorderedActions = computed<AbilityActions[]>(() => {
  const actionsArr = [...Object.values(actions)] as AbilityActions[];

  const readIndex = actionsArr.indexOf(AbilityActions.Read);
  actionsArr.splice(readIndex, 1);
  actionsArr.unshift(AbilityActions.Read);

  const manageIndex = actionsArr.indexOf(AbilityActions.Manage);
  actionsArr.splice(manageIndex, 1);
  actionsArr.push(AbilityActions.Manage);

  return actionsArr;
});

const props = defineProps({
  permissions: {
    type: Array as PropType<Permission[]>,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  saveRequired: {
    type: Boolean,
    default: true,
  },
  creator: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update:permissions", "close"]);

const hasUnsavedChanges = computed(() => {
  // Simple way to make sure nothing has changed. If it has, the user will be prompted to save.
  //  This is not a perfect solution, but it's good enough for now. Actual changes are checked in the parent component.
  return (
    JSON.stringify(localPermissions.value) !== JSON.stringify(props.permissions)
  );
});

defineExpose({
  hasUnsavedChanges,
});

const localPermissions = ref<Permission[]>(
  props.permissions?.map((permission) => ({ ...permission }))
);
// newPermissionsJustReceived is used to make sure we don't try to immediately save changes whenn the changes are
//  because of a change from the parent component (which would create an infinite loop).
const newPermissionsJustReceived = ref(false);
watch(props, () => {
  localPermissions.value = props.permissions?.map((permission) => ({
    ...permission,
  }));
  newPermissionsJustReceived.value = true;
});

// If the save button is disabled, changes should be "saved" immediately
watch(
  localPermissions,
  () => {
    if (newPermissionsJustReceived.value) {
      newPermissionsJustReceived.value = false;
      return;
    }

    if (!props.saveRequired) {
      save();
    }
  },
  { deep: true }
);

const editedPermissionActionSubject = ref<
  [AbilityActions, AbilitySubjects] | null
>(null);

// We use a watcher here instead of referencing the return value directly because we don't want a permission to
//  disappear from the page if the user changes the action/subject of a permission that is being edited. Permissions are
//  then added/removed manually within removePermission and addNewPermission.
const permissionsToEdit = ref<Permission[]>([]);
watch([editedPermissionActionSubject], () => {
  if (editedPermissionActionSubject.value === null) {
    permissionsToEdit.value = [];
  } else {
    permissionsToEdit.value = permissionsForActionAndSubject(
      editedPermissionActionSubject.value[0],
      editedPermissionActionSubject.value[1]
    );
  }
});

// We can't use a dialog on the unload event (i.e. page reload/close/etc.) so we have to use the built-in browser
//  functionality.
useEventListener(window, "beforeunload", (e: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value) {
    e.returnValue = true;
  }
});

function save() {
  emit("update:permissions", localPermissions.value);
}

function closeButtonClicked() {
  if (hasUnsavedChanges.value) {
    dialog.warning({
      title: "Close without saving?",
      content: "Are you sure you want to close without saving?",
      positiveText: "Yes",
      negativeText: "Go Back",
      onPositiveClick: () => {
        emit("close");
      },
    });
  } else {
    emit("close");
  }
}

function formatSubject(subject: string) {
  // Split on capital letters, except for consecutive capital letters
  return subject.replace(/([A-Z][a-z]+)|([A-Z]{2,})/g, " $1$2").trim();
}
function formatAction(action: string) {
  // Capitalize first letter
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function permissionsForActionAndSubject(
  action: AbilityActions,
  subject: AbilitySubjects
) {
  return localPermissions.value.filter(
    (permission) =>
      permission.action === action && permission.subject?.includes(subject)
  );
}

function hasPermission(
  action: AbilityActions,
  subject: AbilitySubjects
): "Yes" | "No" | "Partial" {
  const permissions = permissionsForActionAndSubject(action, subject);

  if (permissions?.length === 0) {
    return "No";
  }

  // If there are any permissions that are not inverted and have no conditions/field restrictions, then the user has
  //  full access
  for (const permission of permissions) {
    if (
      (!permission.fields || permission.fields?.length === 0) &&
      !permission.inverted &&
      Object.keys(permission.conditions ?? {}).length === 0
    ) {
      return "Yes";
    }
  }

  // At this point, there are permissions, but all of them are either inverted or have conditions/field restrictions.
  //  We don't care about what the restrictions are; that is handled in the PermissionsActionSubjectEditor component.
  return "Partial";
}

function permissionButtonClicked(
  action: AbilityActions,
  subject: AbilitySubjects
) {
  editedPermissionActionSubject.value = [action, subject];
}

function addNewPermission() {
  const newPermission = {
    action: editedPermissionActionSubject.value![0],
    subject: [editedPermissionActionSubject.value![1]],
  };
  localPermissions.value.push(newPermission);
  permissionsToEdit.value.push(newPermission);
}

function removePermission(permission: Permission) {
  let index = localPermissions.value.indexOf(permission);
  if (index === -1) {
    return;
  }
  localPermissions.value.splice(index, 1);

  index = permissionsToEdit.value.indexOf(permission);
  if (index === -1) {
    return;
  }
  permissionsToEdit.value.splice(index, 1);
}

function genButtonComponent(
  action: AbilityActions,
  subject: AbilitySubjects
): VNode {
  const hasPerm = hasPermission(action, subject);
  const permCount = permissionsForActionAndSubject(action, subject).length;

  const button = h(
    NButton,
    {
      class: "action-subject-permission",
      small: true,
      secondary: true,
      type: buttonTypes[hasPerm] as any, // I don't know why this cast is necessary. Type error for NButton props
      onClick: () => permissionButtonClicked(action, subject),
    },
    {
      default: () => hasPerm,
    }
  );

  if (permCount >= 2) {
    return h(
      NBadge,
      { value: permCount },
      {
        default: () => button,
      }
    );
  } else {
    return button;
  }
}
</script>

<style scoped lang="scss">
.card {
  height: 80vh;
  overflow-y: auto;
}
.table-wrapper {
  height: calc(80vh - 250px);
  overflow-x: auto;
}
.intro {
  margin-bottom: 1rem;
}
.naive-table {
  // This is needed for position sticky to work
  overflow: initial !important;
  text-align: center;
}
.subject-col {
  text-align: right;
}
.table-header {
  position: sticky;
  z-index: 2;
  top: 0;
}
.action-subject-permission {
  width: 75px;
}
.permission-title {
  font-size: 1.8em;
}
.actions {
  display: flex;
  justify-content: right;
  .action {
    margin-top: 0.5rem;
    margin-left: 0.5rem;
  }
}
</style>
