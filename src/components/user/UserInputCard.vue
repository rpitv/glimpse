<template>
  <div class="card-wrapper">
    <n-card class="card">
      <div v-if="sourceData.loading.value">Loading...</div>
      <div v-else-if="loadingError">
        {{ loadingError }}
      </div>
      <div v-else>
        <h1>Edit User {{ id }}</h1>
        <n-form ref="formRef" :model="inputUser" :rules="rules" inline>
          <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
            <n-form-item-grid-item path="username" label="Username">
              <n-input maxlength="8" v-model:value="inputUser.username" />
            </n-form-item-grid-item>
            <n-form-item-grid-item path="mail" label="Email">
              <n-input maxlength="300" v-model:value="inputUser.mail" />
            </n-form-item-grid-item>
            <n-form-item-grid-item path="discord" label="Discord ID">
              <n-input minlength="18" maxlength="18" v-model:value="inputUser.discord" />
            </n-form-item-grid-item>
          </n-grid>
        </n-form>
        <div>
          <h2>Groups</h2>
          <n-tag class="group-tag" type="primary" closable v-for="group of currentGroups" @close="groupRemoved(group)">
            <RouterLink to="{ name: 'dashboard-groups', params: { id: group.id }}">
              {{group.name}} (ID {{group.id}})
            </RouterLink>
          </n-tag>
          <n-tag class="group-tag deleted" closable v-for="group of groupsToBeDeleted" @close="groupRemoved(group)">
            <RouterLink to="{ name: 'dashboard-groups', params: { id: group.id }}">
              {{group.name}} (ID {{group.id}})
            </RouterLink>
          </n-tag>
          <n-tag class="group-tag added" type="info" closable v-for="group of groupsToBeAdded" @close="groupRemoved(group)">
            <RouterLink to="{ name: 'dashboard-groups', params: { id: group.id }}">
              {{group.name}} (ID {{group.id}})
            </RouterLink>
          </n-tag>
          <GroupSearch @select="groupSelected" :disabled-groups="currentGroups" />
        </div>
        <div>
          <h2>Profile</h2>
          <p>Coming soon</p>
        </div>
        <div class="actions">
          <n-button :disabled="!isFormValid" @click="save" class="action" type="success">
            Save
          </n-button>
          <n-button class="action" v-if="closable" @click="emit('close')" type="error">
            Cancel
          </n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NInput, NForm, NGrid, NFormItemGridItem, NButton, FormRules, FormInst } from "naive-ui";
import type { PropType } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { Group, UpdateUserDocument, UserDetailsDocument } from "@/graphql/types";
import type { User } from "@/graphql/types";
import { computed, onMounted, ref, watchEffect } from "vue";
import validator from "validator";
import GroupSearch from "@/components/group/GroupSearch.vue";

const props = defineProps({
  id: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  },
  closable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["save", "close"]);

const sourceData = useQuery(UserDetailsDocument, { id: props.id });
const mutation = useMutation(UpdateUserDocument);

sourceData.onResult(reloadInputData);
onMounted(reloadInputData);

const loadingError = ref<string>("");
const inputUser = ref<Partial<User>>({});
const groupsToBeDeleted = ref<Pick<Group, "name" | "id">[]>([]);
const groupsToBeAdded = ref<Pick<Group, "name" | "id">[]>([]);
const formRef = ref<FormInst |null>(null);

// isFormValid determines whether the "Save" button is enabled. form validation is
//  async, so we need to use a watcher rather than a computed value.
const isFormValid = ref<boolean>(false);
watchEffect(async () => {
  if(loadingError.value || sourceData.loading.value) {
    isFormValid.value = false;
  } else {
    try {
      await formRef.value?.validate();
      isFormValid.value = true;
    } catch(e) {
      console.debug("Form validation failed: ", e);
      isFormValid.value = false;
    }
  }
});

const currentGroups = computed(() => {
  if(!sourceData.result.value) {
    return [];
  }
  return sourceData.result.value.user?.groups
    ?.map(g => g.group)
    .filter(g => !groupsToBeDeleted.value.find(g2 => g2.id === g?.id));
})

const rules: FormRules = {
  username: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if(!value) {
          return new Error("Username is required.");
        }else if(value.length > 8) {
          return new Error("Username must be 8 characters or less");
        }
      },
    }
  ],
  mail: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if(!value) {
          return new Error("Email is required.");
        } else if(!validator.isEmail(value)) {
          return new Error("Email is not valid.");
        } else if(value.length > 300) {
          return new Error("Email must be 300 characters or less");
        }
      }
    }
  ],
  discord: [
    {
      trigger: "change",
      validator(rule, value) {
        if(!value) {
          return;
        }
        if(!validator.isNumeric(value) || value.length !== 18) {
          return new Error("Discord IDs must be 18 digits long.");
        }
      }
    }
  ]
};

function reloadInputData() {
  loadingError.value = "";
  const result = sourceData.result.value;
  if(!result?.user) {
    loadingError.value = "User not found";
  }
  inputUser.value = { ...result?.user };
}

async function save() {
  try {
    await formRef.value?.validate();
    isFormValid.value = true;
  } catch(e) {
    console.debug("Form validation failed: ", e);
    isFormValid.value = false;
  }
}

function groupSelected(group: Pick<Group, "name" | "id">) {
  if(groupsToBeAdded.value.find(g => g.id === group.id)) {
    return;
  }
  if(inputUser.value.groups?.find(g => g.group?.id === group.id)) {
    return;
  }
  groupsToBeAdded.value.push(group);
}

function groupRemoved(group: Pick<Group, "name" | "id">) {
  if(groupsToBeDeleted.value.find(g => g.id === group.id)) {
    groupsToBeDeleted.value = groupsToBeDeleted.value.filter(g => g.id !== group.id);
  } else if(inputUser.value.groups?.find(g => g.group?.id === group.id)) {
    groupsToBeDeleted.value.push(group);
  } else if(groupsToBeAdded.value.find(g => g.id === group.id)) {
    groupsToBeAdded.value = groupsToBeAdded.value.filter(g => g.id !== group.id);
  }
}

</script>

<style scoped lang="scss">
  .card-wrapper {
    display: flex;
    justify-content: center;
    .card {
      max-width: 1000px;
    }
  }
  .input-item label {
    display: block;
    margin-bottom: 0.5em;
  }

  .group-tag {
    margin-right: 0.5em;
    margin-bottom: 0.5em;

    &.added a {
      font-style: italic;
      color: rgba(112, 192, 232);
    }
    &.deleted a {
      font-style: italic;
      color: rgb(145, 144, 144);
    }
  }

  .actions {
    margin-top: 0.5em;
    display: flex;
    justify-content: right;

    .action {
      margin-left: 0.5em;
    }
  }
</style>
