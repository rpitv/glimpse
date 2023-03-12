<template>
  <div>
    <n-tabs type="segment" animated v-model:value="selectedTab">
      <n-tab-pane v-if="ability.can(AbilityActions.Read, AbilitySubjects.AlertLog)" name="alert" tab="Alert Logs">
        <n-data-table :columns="alertLogColumns" :data="alertLogData" :row-key="row => row.id" :row-class-name="getAlertLogSeverityClass" />
      </n-tab-pane>
      <n-tab-pane v-if="ability.can(AbilityActions.Read, AbilitySubjects.AccessLog)" name="access" tab="Access Logs">
        <n-data-table :columns="accessLogColumns" :data="accessLogData" :row-key="row => row.id" />
      </n-tab-pane>
      <n-tab-pane v-if="ability.can(AbilityActions.Read, AbilitySubjects.AuditLog)" name="audit" tab="Audit Logs">
        <n-data-table :columns="auditLogColumns" :data="auditLogData" :row-key="row => row.id" />
      </n-tab-pane>
    </n-tabs>

  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NDataTable, NTooltip } from "naive-ui";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { AbilitySubjects, FindAccessLogsDocument, FindAuditLogsDocument } from "@/graphql/types";
import type { AlertLog, AccessLog, AuditLog } from "@/graphql/types";
import { FindAlertLogsDocument } from "@/graphql/types";
import { useLazyQuery } from "@vue/apollo-composable";
import { computed, h, ref, watch } from "vue";
import moment from "moment";
import DOMPurify from "dompurify";
import { marked } from "marked";

const ability = useGlimpseAbility();

const tabQueries = {
  alert: useLazyQuery(FindAlertLogsDocument),
  access: useLazyQuery(FindAccessLogsDocument),
  audit: useLazyQuery(FindAuditLogsDocument)
};

const selectedTab = ref<'alert' | 'access' | 'audit'>('alert');

watch(selectedTab, () => {
  tabQueries[selectedTab.value].load()
}, { immediate: true });

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
      let markdown;
      if(row.details.length === 0) {
        markdown = "- No changes";
      } else {
        markdown = '- ' + row.details.join('\n- ');
      }
      return h('div', {
        innerHTML: DOMPurify.sanitize(marked(markdown))
      })
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
      timestamp: h(
        NTooltip,
        { trigger: 'hover' },
        {
          default: () => moment(alertLog.timestamp).format('MMM Do, YYYY h:mm:ss A'),
          trigger: () => moment(alertLog.timestamp).fromNow()
        }
      )
    }
  })
})

const accessLogData = computed(() => {
  return (tabQueries.access.result.value?.accessLogs ?? []).map((accessLog: AccessLog) => {
    return {
      ...accessLog,
      username: accessLog.user?.username,
      timestamp: h(
        NTooltip,
        { trigger: 'hover' },
        {
          default: () => moment(accessLog.timestamp).format('MMM Do, YYYY h:mm:ss A'),
          trigger: () => moment(accessLog.timestamp).fromNow()
        }
      )
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
      timestamp: h(
        NTooltip,
        { trigger: 'hover' },
        {
          default: () => moment(auditLog.timestamp).format('MMM Do, YYYY h:mm:ss A'),
          trigger: () => moment(auditLog.timestamp).fromNow()
        }
      )
    }
  })
})

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
