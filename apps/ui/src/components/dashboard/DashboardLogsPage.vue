<template>
  <div>
    <n-tabs type="segment" animated v-model:value="selectedTab">
      <n-tab-pane v-if="ability.can(AbilityActions.Read, AbilitySubjects.AlertLog)" name="alert" tab="Alert Logs">
        <div ref="alertLogTable">
          <n-data-table :columns="alertLogColumns" :data="alertLogData" :row-key="row => row.id" :loading="tabQueries.alert.loading.value" :row-class-name="getAlertLogSeverityClass" />
        </div>
      </n-tab-pane>
      <n-tab-pane v-if="ability.can(AbilityActions.Read, AbilitySubjects.AccessLog)" name="access" tab="Access Logs">
        <div ref="accessLogTable">
          <n-data-table :columns="accessLogColumns" :data="accessLogData" :row-key="row => row.id" :loading="tabQueries.access.loading.value" />
        </div>
      </n-tab-pane>
      <n-tab-pane v-if="ability.can(AbilityActions.Read, AbilitySubjects.AuditLog)" name="audit" tab="Audit Logs">
        <div ref="auditLogTable">
          <n-data-table :columns="auditLogColumns" :data="auditLogData" :row-key="row => row.id" :loading="tabQueries.audit.loading.value" />
        </div>
      </n-tab-pane>
    </n-tabs>

  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NDataTable } from "naive-ui";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import {
  AbilitySubjects,
  FindAccessLogsDocument,
  FindAccessLogsQuery,
  FindAlertLogsQuery,
  FindAuditLogsDocument, FindAuditLogsQuery
} from "@/graphql/types";
import type { AlertLog, AccessLog, AuditLog } from "@/graphql/types";
import { FindAlertLogsDocument } from "@/graphql/types";
import { useLazyQuery } from "@vue/apollo-composable";
import { computed, h, ref, watch } from "vue";
import Markdown from "@/components/util/Markdown.vue";
import RelativeTimeTooltip from "@/components/util/RelativeTimeTooltip.vue";
import { useScroll } from "@vueuse/core";

const ability = useGlimpseAbility();

const tabQueries = {
  alert: useLazyQuery(FindAlertLogsDocument, {
    pagination: {
      take: 20,
      skip: 0
    }
  }),
  access: useLazyQuery(FindAccessLogsDocument, {
    pagination: {
      take: 20,
      skip: 0
    }
  }),
  audit: useLazyQuery(FindAuditLogsDocument, {
    pagination: {
      take: 20,
      skip: 0
    }
  })
};


const selectedTab = ref<'alert' | 'access' | 'audit'>('alert');

watch(selectedTab, () => {
  tabQueries[selectedTab.value].load()
}, { immediate: true });


const alertLogTable = ref<typeof NDataTable | null>(null);
const accessLogTable = ref<typeof NDataTable | null>(null);
const auditLogTable = ref<typeof NDataTable | null>(null);
const activeTable = computed(() => {
  switch(selectedTab.value) {
    case 'alert':
      return alertLogTable.value;
    case 'access':
      return accessLogTable.value;
    case 'audit':
      return auditLogTable.value;
  }
});

const alertLogColumns = [
  {
    key: 'timestamp',
    title: 'Timestamp',
  },
  {
    key: 'message',
    title: 'Message',
  }
];
const accessLogColumns = [
  {
    key: 'timestamp',
    title: 'Timestamp',
  },
  {
    key: 'username',
    title: 'Username',
  },
  {
    key: 'service',
    title: 'Service',
  },
  {
    key: 'ip',
    title: 'IP Address',
  }
];
const auditLogColumns = [
  {
    type: 'expand',
    renderExpand: (row: AuditLog) => {
      let markdown: string;
      if(row.details.length === 0) {
        markdown = "- No changes";
      } else {
        markdown = '- ' + row.details.join('\n- ');
      }
      return h(Markdown, {}, {
        default: () => markdown
      });
    }
  },
  {
    key: 'timestamp',
    title: 'Timestamp',
  },
  {
    key: 'username',
    title: 'Username',
  },
  {
    key: 'message',
    title: 'Message',
  }
];

const alertLogData = computed(() => {
  return (tabQueries.alert.result.value?.alertLogs ?? []).map((alertLog: AlertLog) => {
    return {
      ...alertLog,
      timestamp: h(RelativeTimeTooltip, { date: new Date(alertLog.timestamp) })
    }
  })
})

const accessLogData = computed(() => {
  return (tabQueries.access.result.value?.accessLogs ?? []).map((accessLog: AccessLog) => {
    return {
      ...accessLog,
      username: accessLog.user?.username,
      timestamp: h(RelativeTimeTooltip, { date: new Date(accessLog.timestamp) })
    }
  })
})

const auditLogData = computed(() => {
  return (tabQueries.audit.result.value?.auditLogs ?? []).map((auditLog: AuditLog) => {
    let description = `${auditLog.action} a ${auditLog.subject}`
    if(auditLog.identifier) {
      description += ` (ID ${auditLog.identifier})`;
    }
    return {
      ...auditLog,
      message: auditLog.message ? `${auditLog.message} (${description})` : description,
      username: auditLog.user?.username,
      timestamp:h(RelativeTimeTooltip, { date: new Date(auditLog.timestamp) })
    }
  })
})

const loadMargins = window.innerHeight;
const scroll = useScroll(window);
watch([scroll.y, tabQueries.access.loading, tabQueries.alert.loading, tabQueries.audit.loading], () => {
  // Data is already being loaded, so when the query completes, loading will be set to false, re-firing this watcher.
  //  Then we check if the bottom of the able is still in view, and if so, load more data.
  if(tabQueries[selectedTab.value].loading.value) {
    return;
  }

  const boundingBox = activeTable.value?.getBoundingClientRect();
  if(!boundingBox) {
    return;
  }
  const bottom = boundingBox.y + boundingBox.height;
  if(bottom - loadMargins < window.innerHeight) {
    loadMore();
  }
})

async function loadMore(): Promise<void> {
  const query = tabQueries[selectedTab.value];

  let result: AlertLog[] | AccessLog[] | AuditLog[];
  let count: number;
  if(selectedTab.value === 'alert') {
    const response = query.result.value as FindAlertLogsQuery;
    result = response?.alertLogs;
    count = response?.alertLogCount ?? 0;
  } else if(selectedTab.value === 'access') {
    const response = query.result.value as FindAccessLogsQuery;
    result = response?.accessLogs;
    count = response?.accessLogCount ?? 0;
  } else if(selectedTab.value === 'audit') {
    const response = query.result.value as FindAuditLogsQuery;
    result = response?.auditLogs;
    count = response?.auditLogCount ?? 0;
  } else {
    return;
  }

  if(!query.loading.value && result.length < count) {
    await query.fetchMore({
      variables: {
        pagination: {
          skip: result.length,
          take: 20
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if(!fetchMoreResult) {
          return prev;
        }
        if(selectedTab.value === 'alert') {
          return {
            ...fetchMoreResult,
            alertLogs: [
              ...result,
              ...(fetchMoreResult as FindAlertLogsQuery).alertLogs
            ]
          }
        } else if(selectedTab.value === 'access') {
          return {
            ...fetchMoreResult,
            accessLogs: [
              ...result,
              ...(fetchMoreResult as FindAccessLogsQuery).accessLogs
            ]
          }
        } else if(selectedTab.value === 'audit') {
          return {
            ...fetchMoreResult,
            auditLogs: [
              ...result,
              ...(fetchMoreResult as FindAuditLogsQuery).auditLogs
            ]
          }
        } else {
          return prev as any;
        }
      }
    })
  }
}

function getAlertLogSeverityClass(row: any) {
  return `dashboard-alert-log-severity-${row.severity?.toLowerCase()}`
}
</script>

<style lang="scss">
.dashboard-alert-log-severity-error td {
  background-color: #2d1212 !important;
}
.dashboard-alert-log-severity-warn td {
  background-color: #312a0d !important;
}
</style>
