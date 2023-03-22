<template>
  <div class="spinner-wrapper" v-if="userPermissionsQuery.loading.value">
    <n-spin>
      <template #description>
        <span>Loading...</span>
      </template>
    </n-spin>
  </div>
  <div v-else>
    <PermissionsEditor
      v-model:permissions="computedPermissions"
      :count="userPermissionsQuery.result.value?.userPermissionCount"
      :closable="closable"
      @close="emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NSpin } from "naive-ui";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  CreateUserPermissionDocument,
  DeleteUserPermissionDocument,
  FindUserPermissionsDocument, UpdateUserPermissionDocument
} from "@/graphql/types";
import PermissionsEditor from "@/components/util/permissions/PermissionsEditor.vue";
import { computed } from "vue";

const props = defineProps({
  userId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  },
  closable: {
    type: Boolean
  }
})

const emit = defineEmits(['close']);

const userPermissionsQuery = useQuery(FindUserPermissionsDocument, {
  filter: {
    userId: {
      equals: Number(props.userId)
    }
  },
  pagination: {
    take: 20,
    skip: 0
  }
});

const createPermissionMutation = useMutation(CreateUserPermissionDocument);
const updatePermissionMutation = useMutation(UpdateUserPermissionDocument);
const deletePermissionMutation = useMutation(DeleteUserPermissionDocument);

const computedPermissions = computed({
  get: () => userPermissionsQuery.result.value?.permissions,
  set: (newValue) => {
    const promises: Promise<any>[] = [];
    const oldValue = userPermissionsQuery.result.value?.permissions;
    if(oldValue?.length) {
      for(const oldPermission of oldValue) {
        const newPermission = newValue?.find(np => np.id === oldPermission.id);
        if(newPermission) {
          if(JSON.stringify(newPermission) !== JSON.stringify(oldPermission)) {
            // The API doesn't accept the ID and __typename fields to be updated, so we delete them from the input.
            //  Additionally, if the fields array is empty, we set it to null, because CASL does not allow empty array
            //  fields.
            delete newPermission.id;
            delete newPermission.__typename;
            if(Array.isArray(newPermission.fields) && newPermission.fields.length === 0) {
              newPermission.fields = null;
            }
            promises.push(updatePermissionMutation.mutate({
              id: oldPermission.id,
              input: newPermission
            }));
          }
        } else {
          promises.push(deletePermissionMutation.mutate({
            id: oldPermission.id
          }));
        }
      }
    }

    if(newValue?.length) {
      for(const newPermission of newValue) {
        // null == undefined, and no other falsey values
        if(newPermission.id == null) {
          promises.push(createPermissionMutation.mutate({
            input: newPermission
          }));
        }
      }
    }

    Promise.all(promises).then(() => {
      userPermissionsQuery.refetch();
    });
  }
})
</script>

<style scoped lang="scss">
  .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
