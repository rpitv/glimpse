<template>
  <v-table height="500px">
    <tbody>
      <tr>
        <td style="width: 300px">Name</td>
        <td>{{ production.name }}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{{ production.email }}</td>
      </tr>
      <tr>
        <td>Phone #</td>
        <td>{{
            production.additionalData.production?.phoneNumber ? production.additionalData.production.phoneNumber : 'No phone number provided'
          }}</td>
      </tr>
      <tr>
        <td>Organization Name</td>
        <td>{{ production.additionalData.organizationName }}</td>
      </tr>
      <tr>
        <td>An RPI Org</td>
        <td>{{ production.additionalData.isStudentOrganization ? '✅' : '❌' }}</td>
      </tr>
      <tr>
        <td>Event Name</td>
        <td>{{ production.subject }}</td>
      </tr>
      <tr>
        <td>Source of Audio Equipment</td>
        <td>
          {{ production.additionalData.audioSource ?? 'None' }}
        </td>
      </tr>
      <tr>
        <td>Livestream</td>
        <td>{{ production.additionalData.livestreamed ? '✅' : '❌'}}</td>
      </tr>
      <tr>
        <td>Event Location</td>
        <td>{{ production.additionalData.location }}</td>
      </tr>
      <tr>
        <td>Event Start Time</td>
        <td>{{ formattedTime(production.additionalData.startTime) }}</td>
      </tr>
      <tr>
        <td>Event End Time</td>
        <td>{{ formattedTime(production.additionalData.endTime) }}</td>
      </tr>
      <tr>
        <td>Additional Information</td>
        <td>{{ production.additionalData.body?.trim().length ? production.additionalData.body : 'None' }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type {ContactSubmission} from "@/graphql/types";
import type {PropType} from "vue";
import {canViewProductionsDashboard} from "@/casl";

const props = defineProps({
  production: {
    type: Object as PropType<Partial<ContactSubmission>>,
    required: true,
  },
});

function formattedTime(time: string) {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

</script>

<style scoped lang="scss">

</style>
