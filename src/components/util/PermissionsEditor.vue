<template>
  <div>
    <n-card class="card">
      <div class="intro">
        <h1>Permissions Editor</h1>
        <n-alert type="warning">
          Make sure you know what you're doing before editing permissions! You should read
          <a href="https://github.com/rpitv/glimpse-api/wiki/CASL-Integration" target="_blank">
            the Glimpse wiki article on CASL
          </a> before doing anything.
        </n-alert>
      </div>
      <div v-if="editedPermissionActionSubject === null" class="table-wrapper">
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
      <div v-else>
        <div v-for="permission of permissionsForActionAndSubject(editedPermissionActionSubject[0], editedPermissionActionSubject[1])" :key="permission.id">
          <h2 class="permission-title">{{permission.id ? `Permission ID ${permission.id}` : 'New Permission'}}</h2>
          <PermissionEditor :permission="permission" />
          <hr />
        </div>
        <div class="actions">
          <n-button class="action" @click="editedPermissionActionSubject = null" type="error" secondary>Back</n-button>
          <n-button class="action" type="success" secondary>Save</n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NCard, NTable, NButton, NBadge } from "naive-ui";
import type { Permission } from "@/graphql/types";
import type { PropType, VNode } from "vue";
import { AbilityActions } from "@/casl";
import { AbilitySubjects } from "@/graphql/types";
import { computed, h, ref } from "vue";
import PermissionEditor from "@/components/util/PermissionEditor.vue";

const buttonTypes = {
  'Yes': 'success',
  'No': 'error',
  'Partial': 'warning'
}


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
})

const props = defineProps({
  permissions: {
    type: Array as PropType<Permission[]>,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:permissions']);

const editedPermissionActionSubject = ref<[AbilityActions, AbilitySubjects]|null>(null);

function formatSubject(subject: string) {
  // Split on capital letters, except for consecutive capital letters
  return subject.replace(/([A-Z][a-z]+)|([A-Z]{2,})/g, " $1$2").trim();
}
function formatAction(action: string) {
  // Capitalize first letter
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function permissionsForActionAndSubject(action: AbilityActions, subject: AbilitySubjects) {
  const perms = props.permissions.filter(permission => permission.action === action && permission.subject?.includes(subject));
  if(!perms || perms.length === 0) {
    return [{
      subject: [subject],
      action
    }]
  }
  return perms;
}

function hasPermission(action: AbilityActions, subject: AbilitySubjects): 'Yes' | 'No' | 'Partial' {
  // permissionsForActionAndSubject returns a basic permission object if there are no permissions for the given action
  //  and subject. These are for the PermissionEditor and we should ignore them when considering whether the user has
  //  a permission by checking if ID is present.
  const permissions = permissionsForActionAndSubject(action, subject)
    .filter(permission => permission.id !== undefined);

  if(permissions?.length === 0) {
    return 'No';
  }

  // If there are any permissions that are not inverted and have no conditions/field restrictions, then the user has
  //  full access
  for(const permission of permissions) {
    if((!permission.fields || permission.fields?.length === 0) && !permission.inverted && Object.keys(permission.conditions ?? {}).length === 0) {
      return 'Yes';
    }
  }

  // At this point, there are permissions, but all of them are either inverted or have conditions/field restrictions.
  //  We don't care about what the restrictions are; that is handled in the PermissionsActionSubjectEditor component.
  return 'Partial';
}

function genButtonComponent(action: AbilityActions, subject: AbilitySubjects): VNode {
  /*
  <n-badge :value="3">
    <n-button class="action-subject-permission" small secondary :type="buttonTypes[hasPermission(action, subject)]" @click="editedPermissionActionSubject = [action, subject]">
      {{ hasPermission(action, subject) }}
    </n-button>
  </n-badge>
   */
  const hasPerm = hasPermission(action, subject);
  const permCount = permissionsForActionAndSubject(action, subject).length;

  const button = h(NButton, {
    class: 'action-subject-permission',
    small: true,
    secondary: true,
    type: buttonTypes[hasPerm] as any, // I don't know why this cast is necessary. Type error for NButton props
    onClick: () => editedPermissionActionSubject.value = [action, subject]
  }, {
    default: () => hasPerm
  });

  if(permCount >= 2) {
    return h(NBadge, { value: permCount }, {
      default: () => button
    })
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
.naive-table { // This is needed for position sticky to work
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
