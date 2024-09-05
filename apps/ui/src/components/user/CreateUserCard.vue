<template>
  <v-card>
    <v-card-title>
      Create User
    </v-card-title>
    <v-stepper v-model="step" :flat="true" :editable="validation">
      <template #actions="{prev, next}">
        <v-stepper-header>
          <v-stepper-item :value="1" title="User Details" :editable="true" :complete="step > 1"/>
          <v-divider />
          <v-stepper-item :value="2" title="Groups" :complete="step > 2" />
          <v-divider />
          <v-stepper-item :value="3" title="Permissions"  :complete="step > 3" />
          <v-divider />
          <v-stepper-item :value="4" title="Person" :complete="step > 4" />
          <v-divider />
          <v-stepper-item :value="5" title="Review" subtitle="Review the data to be submitted and make sure there are no mistakes" />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <v-form ref="requiredForm">
              <UserDetails :userData="userData" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <GroupTable :groups="groups" :take="take" @addGroup="addGroup" />
            <GroupRow :groups="groups" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <PermissionsEditor
              :save-required="false"
              :count="permissionsToAdd.length"
              v-model:permissions="permissionsToAdd"
              :creator="true"
            />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <PeopleTable :person="person" :take="take" @attachPerson="attachPerson"/>
            <PeopleRow @close="person = {}" :person="person"/>
          </v-stepper-window-item>
          <v-stepper-window-item :value="5">
            <ReviewTable :person="person" :permissionsToAdd="permissionsToAdd" :groups="groups" :userData="userData" />
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" prev-text="PREVIOUS" :next-text="step >= 5 ? 'CREATE' : 'NEXT'"
                           :disabled="checkDisable" />
      </template>
    </v-stepper>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ error }}</v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import UserDetails from "@/components/user/UserDetailsInput/UserDetails.vue";
import {CreateUserDocument, CreateUserGroupDocument, CreateUserPermissionDocument} from "@/graphql/types";
import type { Group, Person, User, UserPermission} from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import GroupTable from "@/components/user/UserDetailsInput/GroupTable.vue";
import GroupRow from "@/components/user/UserDetailsInput/GroupRow.vue";
import PermissionsEditor from "@/components/util/permissions/PermissionsEditor.vue";
import PeopleRow from "@/components/user/UserDetailsInput/PeopleRow.vue";
import PeopleTable from "@/components/user/UserDetailsInput/PeopleTable.vue";
import ReviewTable from "@/components/user/UserDetailsInput/ReviewTable.vue";

const take = 20;
const step = ref(1);
const loading = ref(false);
const error = ref<string | null>(null);
const snackbar = ref(false);
const userData = ref<Partial<User>>({});
const groups = ref<Partial<Group>[]>([]);
const permissionsToAdd = ref<UserPermission[]>([]);
const person = ref<Partial<Person>>({});
const requiredForm = ref();
const validation = ref(false);
const emit = defineEmits(["save"]);

const createUserMutation = useMutation(CreateUserDocument);
const createUserGroupMutation = useMutation(CreateUserGroupDocument);
const createUserPermissionMutation = useMutation(CreateUserPermissionDocument);

async function validate(next: () => void) {
  loading.value = false;
  if (step.value < 5) {
    if (validation.value)
      next();
    return;
  }

  let createdUser;
  try {
    createdUser = await createUserMutation.mutate({
      data: {
        username: userData.value.username,
        mail: userData.value.mail,
        discord: userData.value.discord,
        personId: person.value.id ?? null
      }
    });
    for (const group of groups.value) {
      try {
        const createdUserGroup = await createUserGroupMutation.mutate({
          userId: createdUser?.data?.user.id,
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
    for (const permission of permissionsToAdd.value) {
      try {
        const createdUserPermission = await createUserPermissionMutation.mutate(
          {
            input: {
              userId: createdUser?.data?.user.id,
              ...permission,
            },
          }
        );

        if (!createdUserPermission?.data?.permission) {
          error.value = "Failed to grant permission to user";
          return;
        }
      } catch (e) {
        console.error(e);
        error.value = "Failed to grant permission to user";
        return;
      }
    }

    emit("save", createdUser?.data?.user.id);
  } catch (e) {
    loading.value = false;
    error.value = "Failed to create user";
    snackbar.value = true;
    console.error(e);
    return;
  }
}

function addGroup(id: number, name: string) {
  groups.value.push({
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

watch(userData, async () => {
  if (requiredForm.value) {
    const valid = await requiredForm.value.validate();
    validation.value = valid.valid;
  }
}, {deep: true});

const checkDisable = computed(() => {
  if (loading.value)
    return true;
  if (step.value === 1)
    return "prev";
  return false;
});
</script>

<style scoped lang="scss">

</style>
