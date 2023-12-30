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
            production.additionalData.production.phone.trim().length ? production.additionalData.production.phone : 'No phone number provided'
          }}</td>
      </tr>
      <tr>
        <td>Organization</td>
        <td>{{ production.additionalData.production.organization }}</td>
      </tr>
      <tr>
        <td>Paying for our services</td>
        <td>{{ production.additionalData.production.services.paying ? '✅' : '❌' }}</td>
      </tr>
      <tr>
        <td>Services Requested</td>
        <td>
          <v-chip-group>
            <v-chip v-for="request of production.additionalData.production.services.request">
              {{ request }}
            </v-chip>
          </v-chip-group>
        </td>
      </tr>
      <tr>
        <td>Source of Audio Equipment</td>
        <td>
          {{ production.additionalData.production.equipment.exists ? production.additionalData.production.equipment.provider : 'None' }}
        </td>
      </tr>
      <tr>
        <td>Event Location</td>
        <td>{{ production.additionalData.production.eventLocation }}</td>
      </tr>
      <tr>
        <td>Event Start Time</td>
        <td>{{ formattedTime(production.additionalData.production.eventStartTime) }}</td>
      </tr>
      <tr>
        <td>Event End Time</td>
        <td>{{ formattedTime(production.additionalData.production.eventEndTime) }}</td>
      </tr>
      <tr>
        <td>Possible Needs</td>
        <td>{{ production.additionalData.production.uniqueNeeds.trim().length ? production.additionalData.production.uniqueNeeds : 'No needs' }}</td>
      </tr>
      <tr>
        <td>Questions</td>
        <td>{{ production.additionalData.production.questions.trim().length? production.additionalData.production.questions : 'No questions' }}</td>
      </tr>
      <tr>
        <td>Additional Links</td>
        <td>{{ production.additionalData.production.links.trim().length ? production.additionalData.production.links : 'No links'}}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type {ContactSubmission} from "@/graphql/types";
import type {PropType} from "vue";

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
