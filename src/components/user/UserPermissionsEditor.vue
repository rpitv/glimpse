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
      :permissions="userPermissionsQuery.result.value?.permissions"
      :count="userPermissionsQuery.result.value?.userPermissionCount"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NSpin } from "naive-ui";
import { useQuery } from "@vue/apollo-composable";
import { FindUserPermissionsDocument } from "@/graphql/types";
import PermissionsEditor from "@/components/util/PermissionsEditor.vue";

const props = defineProps({
  userId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  }
})

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
</script>

<style scoped lang="scss">
  .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
