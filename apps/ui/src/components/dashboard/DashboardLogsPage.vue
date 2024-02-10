<template>
  <div>
    <v-tabs v-model="selectedTab" :align-tabs="'center'" color="primary" :grow="$vuetify.display.xs">
      <v-tab value="alert" v-if="ability.can(AbilityActions.Read, AbilitySubjects.AlertLog)">
        <p class="log-tab-text">Alert Logs</p>
      </v-tab>
      <v-tab value="access" v-if="ability.can(AbilityActions.Read, AbilitySubjects.AccessLog)">
        <p class="log-tab-text">Access Logs</p>
      </v-tab>
      <v-tab value="audit" v-if="ability.can(AbilityActions.Read, AbilitySubjects.AuditLog)">
        <p class="log-tab-text">Audit Logs</p>
      </v-tab>
    </v-tabs>

    <div>
      <v-window v-model="selectedTab">
        <v-window-item value="alert" v-if="ability.can(AbilityActions.Read, AbilitySubjects.AlertLog)">
          <v-infinite-scroll class="logs-infinite-scroller" :items="alertLogData" :onLoad="loadMore">
            <v-table>
              <thead>
              <tr>
                <th>Timestamp</th>
                <th>Message</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in alertLogData" :key="item.id"  :class="getAlertLogSeverityClass(item)">
                <td style="min-width: 150px"><RelativeTimeTooltip :date="new Date(item.timestamp)" /></td>
                <td style="min-width: 200px">{{item.message}}</td>
              </tr>
              </tbody>
            </v-table>
            <template v-slot:empty>
              <p class="text-center">No more results</p>
            </template>
          </v-infinite-scroll>
        </v-window-item>

        <v-window-item value="access" v-if="ability.can(AbilityActions.Read, AbilitySubjects.AccessLog)">
            <v-infinite-scroll class="logs-infinite-scroller" :items="accessLogData" :onLoad="loadMore">
              <v-table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Username</th>
                    <th>Service</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in accessLogData" :key="item.id">
                    <td style="min-width:150px">
                      <RelativeTimeTooltip :date="new Date(item.timestamp)" />
                    </td>
                    <td style="min-width:150px">{{item.user?.username ?? "Unknown"}}</td>
                    <td style="min-width:200px">{{item.service}}</td>
                    <td style="min-width:150px">{{item.ip}}</td>
                  </tr>
                </tbody>
              </v-table>
              <template v-slot:empty>
                <p class="text-center">No more results</p>
              </template>
            </v-infinite-scroll>
        </v-window-item>

        <v-window-item value="audit" v-if="ability.can(AbilityActions.Read, AbilitySubjects.AuditLog)">
          <v-infinite-scroll class="logs-infinite-scroller" :items="auditLogData" :onLoad="loadMore">
            <v-table>
              <thead>
              <tr>
                <th /> <!-- Blank header for + icon, expanding full audit details -->
                <th>Timestamp</th>
                <th>Username</th>
                <th>Summary</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="item in auditLogData" :key="item.id">
                <tr>
                  <td @click="expandedAuditLogs[item.id] = !expandedAuditLogs[item.id]">
                    <font-awesome-icon v-if="!expandedAuditLogs[item.id]" icon="fal fa-plus" />
                    <font-awesome-icon v-else icon="fal fa-minus" />
                  </td>
                  <td style="min-width:150px">
                    <RelativeTimeTooltip :date="new Date(item.timestamp)" />
                  </td>
                  <td style="min-width:150px">{{item.user?.username ?? "Unknown"}}</td>
                  <td style="min-width:200px">{{ formatAuditLogSummary(item) }}</td>
                </tr>
                <tr v-if="expandedAuditLogs[item.id]">
                  <td /> <!-- Skip the +/- column -->
                  <td colspan="3" class="audit-log-details">
                    <p v-for="detail in item.details">
                      <Markdown>{{ detail }}</Markdown>
                    </p>
                  </td>
                </tr>
              </template>
              </tbody>
            </v-table>
            <template v-slot:empty>
              <p class="text-center">No more results</p>
            </template>
          </v-infinite-scroll>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AbilityActions, useGlimpseAbility } from "@/casl";
import type {FindAccessLogsQuery, FindAlertLogsQuery, FindAuditLogsQuery } from "@/graphql/types"
import {AbilitySubjects, FindAccessLogsDocument, FindAuditLogsDocument } from "@/graphql/types";
import type { AlertLog, AccessLog, AuditLog } from "@/graphql/types";
import { FindAlertLogsDocument } from "@/graphql/types";
import { useLazyQuery } from "@vue/apollo-composable";
import { computed, h, ref, watch } from "vue";
import Markdown from "@/components/util/Markdown.vue";
import RelativeTimeTooltip from "@/components/util/RelativeTimeTooltip.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
  return tabQueries.alert.result.value?.alertLogs ?? []
})

const accessLogData = computed(() => {
  return tabQueries.access.result.value?.accessLogs ?? []
})

const auditLogData = computed(() => {
  return tabQueries.audit.result.value?.auditLogs ?? [];
})

const expandedAuditLogs = ref<{[key: number]: boolean}>({});

function formatAuditLogSummary(auditLog: AuditLog): string {
  let description = `${auditLog.action} a ${auditLog.subject}`
  if(auditLog.identifier) {
    description += ` (ID ${auditLog.identifier})`;
  }
  return auditLog.message ? `${auditLog.message} (${description})` : description
}

async function loadMore({done}: { done: (status: 'ok' | 'error' | 'empty' | 'loading') => void }): Promise<void> {
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
    done('error');
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
          done('empty');
          return prev;
        }
        if(selectedTab.value === 'alert') {
          done('ok')
          return {
            ...fetchMoreResult,
            alertLogs: [
              ...result,
              ...(fetchMoreResult as FindAlertLogsQuery).alertLogs
            ]
          }
        } else if(selectedTab.value === 'access') {
          done('ok')
          return {
            ...fetchMoreResult,
            accessLogs: [
              ...result,
              ...(fetchMoreResult as FindAccessLogsQuery).accessLogs
            ]
          }
        } else if(selectedTab.value === 'audit') {
          done('ok')
          return {
            ...fetchMoreResult,
            auditLogs: [
              ...result,
              ...(fetchMoreResult as FindAuditLogsQuery).auditLogs
            ]
          }
        } else {
          done('empty')
          return prev as any;
        }
      }
    })
  } else {
    done('empty')
  }
}

function getAlertLogSeverityClass(row: any) {
  return `dashboard-alert-log-severity-${row.severity?.toLowerCase()}`
}
</script>

<style lang="scss" scoped>
.dashboard-alert-log-severity-error td {
  background-color: #2d1212 !important;
}
.dashboard-alert-log-severity-warn td {
  background-color: #312a0d !important;
}

.log-tab-text {
  text-align: center;
}
.audit-log-details {
  padding: 10px 0 !important;
}
</style>
