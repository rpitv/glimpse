<template>
  <div class="spinner-wrapper" v-if="groupPermissionsQuery.loading.value">
    <n-spin>
      <template #description>
        <span>Loading...</span>
      </template>
    </n-spin>
  </div>
  <div v-else>
    <PermissionsEditor
      ref="editor"
      v-model:permissions="computedPermissions"
      :count="groupPermissionsQuery.result.value?.groupPermissionCount"
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
  CreateGroupPermissionDocument,
  DeleteGroupPermissionDocument,
  FindGroupPermissionsDocument,
  UpdateGroupPermissionDocument,
} from "@/graphql/types";
import PermissionsEditor from "@/components/util/permissions/PermissionsEditor.vue";
import { computed, ref } from "vue";

const props = defineProps({
  groupId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
  closable: {
    type: Boolean,
  },
});

const emit = defineEmits(["close"]);

// Forward the hasUnsavedChanges property from the PermissionsEditor component up to the parent
const editor = ref<PermissionsEditor>(null);
const hasUnsavedChanges = computed(() => {
  return editor.value?.hasUnsavedChanges;
});
defineExpose({ hasUnsavedChanges });

const groupPermissionsQuery = useQuery(FindGroupPermissionsDocument, {
  filter: {
    groupId: {
      equals: Number(props.groupId),
    },
  },
  pagination: {
    take: 20,
    skip: 0,
  },
});

const createPermissionMutation = useMutation(CreateGroupPermissionDocument);
const updatePermissionMutation = useMutation(UpdateGroupPermissionDocument);
const deletePermissionMutation = useMutation(DeleteGroupPermissionDocument);

const computedPermissions = computed({
  get: () => groupPermissionsQuery.result.value?.permissions,
  set: (newValue) => {
    const promises: Promise<any>[] = [];
    const oldValue = groupPermissionsQuery.result.value?.permissions;

    // Note: currently the creations have to come before the updates, because the updates will delete the ID field
    //  which we rely on to determine if the permission is new or not.
    if (newValue?.length) {
      for (const newPermission of newValue) {
        // null == undefined, and no other falsey values
        if (newPermission.id == null) {
          promises.push(
            createPermissionMutation.mutate({
              input: {
                ...newPermission,
                groupId: props.groupId,
              },
            })
          );
        }
      }
    }

    if (oldValue?.length) {
      for (const oldPermission of oldValue) {
        const newPermission = newValue?.find(
          (np) => np.id === oldPermission.id
        );
        if (newPermission) {
          if (JSON.stringify(newPermission) !== JSON.stringify(oldPermission)) {
            // The API doesn't accept the ID and __typename fields to be updated, so we delete them from the input.
            //  Additionally, if the fields array is empty, we set it to null, because CASL does not allow empty array
            //  fields.
            delete newPermission.id;
            delete newPermission.__typename;
            if (
              Array.isArray(newPermission.fields) &&
              newPermission.fields.length === 0
            ) {
              newPermission.fields = null;
            }
            promises.push(
              updatePermissionMutation.mutate({
                id: oldPermission.id,
                input: newPermission,
              })
            );
          }
        } else {
          promises.push(
            deletePermissionMutation.mutate({
              id: oldPermission.id,
            })
          );
        }
      }
    }

    Promise.all(promises).then(() => {
      groupPermissionsQuery.refetch();
    });
  },
});
</script>

<style scoped lang="scss">
.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
