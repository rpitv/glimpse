<template>
  <div>
    <n-layout>
      <RouterPopup
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.Video)"
        :max-width="1100"
        v-model="showCreatePopup"
        :to="{ name: 'dashboard-video-create' }"
      >
        <CreateVideoCard
          closable
          @save="
            showCreatePopup = false;
            refresh();
          "
          @close="showCreatePopup = false"
        />
        <template #trigger>
          <n-button type="success" class="top-button" round>
            <template #icon>
              <FontAwesomeIcon icon="fa-light fa-plus" />
            </template>
            Create
          </n-button>
        </template>
      </RouterPopup>
      <n-button class="top-button" @click="refresh" round>
        <template #icon>
          <FontAwesomeIcon icon="fa-light fa-arrows-rotate" />
        </template>
        Refresh
      </n-button>
    </n-layout>
    <n-layout>
      <!-- For some reason, I'm running into accessing undefined errors when n-data-table is not a child of another NaiveUI element -->
      <div style="overflow: auto">
        <n-data-table
          class="video-data-table"
          :columns="columns"
          :data="queryData.result.value?.videos ?? []"
          :row-key="(row) => row.id"
        />
      </div>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NButton, NDataTable, NLayout, useDialog } from "naive-ui";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects,
  DeleteVideoDocument,
  FindVideosDocument,
} from "@/graphql/types";
import type { Video } from "@/graphql/types";
import { computed, h, onMounted, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import { useRoute } from "vue-router";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditVideoCard from "@/components/video/EditVideoCard.vue";
import CreateVideoCard from "@/components/video/CreateVideoCard.vue";

const ability = useGlimpseAbility();
const dialog = useDialog();
const route = useRoute();

const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);

const queryData = useQuery(FindVideosDocument, {
  pagination: {
    take: 20,
    skip: 0,
  },
});
const deleteMutation = useMutation(DeleteVideoDocument);

const columns = [
  {
    key: "id",
    title: "ID",
    render(row: Video) {
      const rowPopupKey = `${row.id}-id`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) =>
          (shownPopup.value = value ? rowPopupKey : null),
      });
      return h(
        RouterPopup,
        {
          maxWidth: 900,
          to: { name: "dashboard-video-details-edit", params: { id: row.id } },
          modelValue: isPopupShown.value,
          "onUpdate:modelValue": (value: boolean) =>
            (isPopupShown.value = value),
        },
        {
          default: () =>
            h(EditVideoCard, {
              closable: true,
              videoId: BigInt(row.id),
              onSave: () => {
                isPopupShown.value = false;
                refresh();
              },
              onClose: () => {
                isPopupShown.value = false;
              },
            }),
          trigger: () => row.id,
        }
      );
    },
  },
  {
    key: "name",
    title: "Name",
    render(row: Video) {
      const rowPopupKey = `${row.id}-name`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) =>
          (shownPopup.value = value ? rowPopupKey : null),
      });
      return h(
        RouterPopup,
        {
          maxWidth: 900,
          to: { name: "dashboard-video-details-edit", params: { id: row.id } },
          modelValue: isPopupShown.value,
          "onUpdate:modelValue": (value: boolean) =>
            (isPopupShown.value = value),
        },
        {
          default: () =>
            h(EditVideoCard, {
              closable: true,
              videoId: BigInt(row.id),
              onSave: () => {
                isPopupShown.value = false;
                refresh();
              },
              onClose: () => {
                isPopupShown.value = false;
              },
            }),
          trigger: () => row.name,
        }
      );
    },
  },
  {
    key: "format",
    title: "Format",
  },
  {
    key: "metadata.url",
    title: "URL",
  },
  {
    key: "actions",
    title: "Actions",
    render: (row: Video) => {
      const rowPopupKey = `${row.id}-edit`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) =>
          (shownPopup.value = value ? rowPopupKey : null),
      });
      const buttons = [];
      if (
        ability.can(
          AbilityActions.Update,
          subject(AbilitySubjects.Video, { ...row })
        )
      ) {
        buttons.push(
          h(
            RouterPopup,
            {
              maxWidth: 900,
              to: {
                name: "dashboard-video-details-edit",
                params: { id: row.id },
              },
              modelValue: isPopupShown.value,
              "onUpdate:modelValue": (value: boolean) =>
                (isPopupShown.value = value),
            },
            {
              default: () =>
                h(EditVideoCard, {
                  closable: true,
                  videoId: BigInt(row.id),
                  onSave: () => {
                    isPopupShown.value = false;
                    refresh();
                  },
                  onClose: () => {
                    isPopupShown.value = false;
                  },
                }),
              trigger: () =>
                h(
                  NButton,
                  {
                    class: "dashboard-videos-page-row-button",
                    type: "info",
                    secondary: true,
                    size: "small",
                  },
                  () => "Edit"
                ),
            }
          )
        );
      }
      if (
        ability.can(
          AbilityActions.Delete,
          subject(AbilitySubjects.Video, { ...row })
        )
      ) {
        buttons.push(
          h(
            NButton,
            {
              class: "dashboard-videos-page-row-button",
              type: "error",
              secondary: true,
              size: "small",
              onClick: () =>
                dialog.error({
                  title: "Delete Video",
                  content: `Are you sure you want to delete the video "${row.name}"? This will also remove it from associated productions.`,
                  positiveText: "Delete Video",
                  negativeText: "Cancel",
                  onPositiveClick: async () => {
                    await deleteMutation.mutate({ id: row.id });
                    await refresh();
                  },
                }),
            },
            () => "Delete"
          )
        );
      }
      return h("div", {}, buttons);
    },
  },
];

onMounted(async () => {
  await refresh();
});

async function refresh() {
  await queryData.refetch();
}
</script>

<style lang="scss">
.dashboard-videos-page-row-button {
  margin-right: 0.5rem;
}
</style>

<style scoped lang="scss">
.video-data-table {
  min-width: 500px;
}

.top-button {
  margin-bottom: 1rem;
  margin-left: 1rem;
  float: right;
}
</style>
