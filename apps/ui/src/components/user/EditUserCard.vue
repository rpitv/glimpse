<template>
  <v-card>
    <v-card-title>
      Edit User {{ id }}
    </v-card-title>
    <div v-if="sourceData.loading.value" class="flex-container" style="justify-content: center" >
      <div>
        <v-progress-circular color="error" indeterminate></v-progress-circular>
        <h2>Loading</h2>
      </div>
    </div>
    <v-stepper v-model="step" :flat="true" v-else>
      <template #actions="{prev, next}">
        <v-stepper-header>
          <v-stepper-item :value="1" title="User Details" :editable="step > 1" :complete="step > 1"/>
          <v-divider />
          <v-stepper-item :value="2" title="Groups" :editable="step > 1" :complete="step > 2" />
          <v-divider />
          <v-stepper-item :value="3" title="Permissions"  :editable="step > 1" :complete="step > 3" />
          <v-divider />
          <v-stepper-item :value="4" title="Person" :editable="step > 1" :complete="step > 4" />
          <v-divider />
          <v-stepper-item :value="5" title="Review" subtitle="Review the data to be submitted and make sure there are no mistakes" :editable="step > 1" />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <v-form ref="requiredForm">
              <UserDetails :userData="userData" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <GroupTable :groups="newGroups" :take="take" @addGroup="addGroup" />
            <GroupRow :groups="newGroups" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <PermissionsEditor
              :save-required="false"
              :count="newPermissions.length"
              v-model:permissions="newPermissions"
              :creator="true"
            />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <PeopleTable :person="person" :take="take" @attachPerson="attachPerson"/>
            <PeopleRow :person="person"/>
          </v-stepper-window-item>
          <v-stepper-window-item :value="5">
            <ReviewTable :person="person" :permissionsToAdd="newPermissions" :groups="newGroups" :userData="userData" />
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" prev-text="PREVIOUS" :next-text="step >= 5 ? 'EDIT' : 'NEXT'"
                           :disabled="checkDisable" />
      </template>
    </v-stepper>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ error }}</v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { PropType } from "vue";
import UserDetails from "@/components/user/UserDetailsInput/UserDetails.vue";
import {
  CreateUserGroupDocument,
  DeleteUserGroupDocument,
  CreateUserPermissionDocument,
  UpdateUserPermissionDocument,
  DeleteUserPermissionDocument,
  UpdateUserDocument,
  UserDetailsDocument,
} from "@/graphql/types";
import type { Group, Person, User, UserGroup, UserPermission} from "@/graphql/types";
import { useQuery, useMutation } from "@vue/apollo-composable";
import GroupTable from "@/components/user/UserDetailsInput/GroupTable.vue";
import GroupRow from "@/components/user/UserDetailsInput/GroupRow.vue";
import PermissionsEditor from "@/components/util/permissions/PermissionsEditor.vue";
import PeopleRow from "@/components/user/UserDetailsInput/PeopleRow.vue";
import PeopleTable from "@/components/user/UserDetailsInput/PeopleTable.vue";
import ReviewTable from "@/components/user/UserDetailsInput/ReviewTable.vue";

const props = defineProps({
  id: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const take = 20;
const step = ref(1);
const loading = ref(false);
const error = ref<string | null>(null);
const snackbar = ref(false);
const userData = ref<Partial<User>>({});
const oldGroups = ref<Partial<UserGroup>[]>([]);
const newGroups = ref<Partial<Group>[]>([]);
const oldPermissions = ref<UserPermission[]>([]);
const newPermissions = ref<UserPermission[]>([]);
const person = ref<Partial<Person>>({});
const requiredForm = ref();
const emit = defineEmits(["save"]);

const sourceData = useQuery(UserDetailsDocument, { id: props.id });
const updateUserMutation = useMutation(UpdateUserDocument);
const createUserGroupMutation = useMutation(CreateUserGroupDocument);
const deleteUserGroupMutation = useMutation(DeleteUserGroupDocument);
const createUserPermissionMutation = useMutation(CreateUserPermissionDocument);
const deleteUserPermissionMutation = useMutation(DeleteUserPermissionDocument);
const updateUserPermissionMutation = useMutation(UpdateUserPermissionDocument);


sourceData.onResult((result) => {
  if (result.loading) return;
  const user = result.data.user;

  oldGroups.value = [];
  newGroups.value = [];
  oldPermissions.value = [];
  newPermissions.value = [];

  userData.value = {
    username: user?.username,
    mail: user?.mail,
    discord: user?.discord,
  }

  const groups = user?.groups;
  if (groups)
    for (let i = 0; i < groups.length; i++) {
      oldGroups.value[i] = groups[i];
      newGroups.value[i] = groups[i].group as Group;
    }


  const permissions = user?.permissions;
  if (permissions)
    for (let i = 0; i < permissions.length; i++) {
      oldPermissions.value[i] = permissions[i];
      newPermissions.value[i] = permissions[i];
    }


  const personResult = user?.person;
  if (personResult)
    person.value = personResult;
})

async function validate(next: () => void) {
  const validation = await requiredForm.value.validate();
  loading.value = false;
  if (step.value < 5) {
    if (validation.valid)
      next();
    return;
  }
  try {
    await updateUserMutation.mutate({
      id: props.id,
      data: {
        username: userData.value.username,
        mail: userData.value.mail,
        discord: userData.value.discord,
        personId: person.value.id ?? null
      },
    });

    // newGroups has type Group instead of UserGroup
    const groupsToCreate = newGroups.value.filter((newGroup) => !oldGroups.value.some((oldGroup) => oldGroup.groupId === newGroup.id));
    const groupsToDelete = oldGroups.value.filter((oldGroup) => !newGroups.value.some((newGroup) => oldGroup.groupId === newGroup.id));

    // Add any groups that have been added
    for (const group of groupsToCreate) {
      try {
        const createdUserGroup = await createUserGroupMutation.mutate({
          userId: props.id,
          groupId: group.id,
        });
        if (!createdUserGroup?.data?.userGroup) {
          error.value = "Failed to add user to group";
          return;
        }
      } catch (e) {
        console.error(e);
        error.value = `Failed to add user to the group "${group.name} (ID ${group.id})"`;
        return;
      }
    }

    for (const group of groupsToDelete) {
      try {
        await deleteUserGroupMutation.mutate({
          id: group.id,
        });

      } catch (e) {
        console.error(e);
        error.value = `Failed to remove user from the group "${group.group?.name} (ID ${group.id})"`;
        return;
      }
    }


    const permissionsToCreate = newPermissions.value.filter((newPermission) => !newPermission.id);
    const permissionsToUpdate = newPermissions.value.filter((newPermission) => !oldPermissions.value.some((oldPermission) => JSON.stringify(oldPermission) === JSON.stringify(newPermission) || !newPermission.id));
    const permissionsToDelete = oldPermissions.value.filter((oldPermission) => !newPermissions.value.some((newPermission) => oldPermission.id === newPermission.id));

    console.log("Old Permissions: ", oldPermissions.value);
    console.log("New Permissions: ", newPermissions.value);
    console.log("Permissions To Create: ", permissionsToCreate);
    console.log("Permissions To Update: ", permissionsToUpdate);
    console.log("Permissions To Delete: ", permissionsToDelete);

    for (let permission of permissionsToCreate) {
      try {
        permission.userId = props.id;
        const createdUserPermission = await createUserPermissionMutation.mutate({
          input: permission
        });
        if (!createdUserPermission?.data?.permission) {
          error.value = "Failed to add permission to user";
          return;
        }
      } catch (e) {
        console.error(e);
        error.value = `Failed to add permissions to the user`;
        return;
      }
    }

    for (const permission of permissionsToUpdate) {
      try {
        await updateUserPermissionMutation.mutate({
          id: permission.id,
          input: {
            userId: permission.userId,
            action: permission.action,
            conditions: permission.conditions,
            fields: permission.fields,
            inverted: permission.inverted,
            reason: permission.reason,
            subject: permission.subject
          }
        });
      } catch (e) {
        console.error(e);
        error.value = `Failed to update permission ${permission.id}`;
        return;
      }
    }

    for (const permission of permissionsToDelete) {
      try {
        await deleteUserPermissionMutation.mutate({
          id: permission.id
        });
      } catch (e) {
        console.error(e);
        error.value = `Failed to delete permission ${permission.id}`;
        return;
      }
    }

    emit("save", props.id);
  } catch (e) {
    loading.value = false;
    error.value = "Failed to edit user";
    snackbar.value = true;
    console.error(e);
    return;
  }

}

function addGroup(id: number, name: string) {
  newGroups.value.push({
    id: id,
    name: name
  });
}

function attachPerson(id: number, name: string) {
  person.value = {
    id: id,
    name: name
  };
}

const checkDisable = computed(() => {
  if (loading.value)
    return true;
  if (step.value === 1)
    return "prev";
  return false;
});

onMounted(() => {
  sourceData.refetch();
})
</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
  text-align: center;
  align-items: center;
}
</style>
