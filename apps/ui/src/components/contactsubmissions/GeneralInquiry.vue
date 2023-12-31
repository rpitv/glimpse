<template>
  <v-table height="500px">
    <tbody>
      <tr>
        <td style="width: 300px">Name</td>
        <td>{{ inquiry.name }}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{{ inquiry.email }}</td>
      </tr>
      <tr>
        <td>Inquiry</td>
        <td>{{ inquiry.body }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {ContactSubmission} from "@/graphql/types";

defineProps({
  inquiry: {
    type: Object as PropType<Partial<ContactSubmission>>,
    required: true,
  }
})
</script>

<style scoped lang="scss">

</style>
