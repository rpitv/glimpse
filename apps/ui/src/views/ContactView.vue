<template>
  <div class="center">
    <v-snackbar v-model="missing" color="red-darken-2">
      One or more of your fields are missing or incorrect, please make sure everything required is filled out and the information is .
      <template #actions>
        <v-btn icon="fa-circle-xmark" @click="missing = false" />
      </template>
    </v-snackbar>
    <v-card class="card" color="#1B1B1B">
      <div v-if="submissionReceived">
        <div class="mt-10" style="display: flex; justify-content: center;">
          <FontAwesomeIcon icon="fa-sharp fa-circle-check" class="icon"/>
        </div>
        <h1 class="text-center">We've received your submission! We'll respond within 1-2 business weeks at the time of your submission.</h1>
      </div>
      <div v-else>
        <v-card-text>
          <p style="font-size: 20px">Do you have a request or inquiry for us? Submit this form! </p>
        </v-card-text>
        <v-select label="Choose the type of request" class="mt-5"
                  :items="['Production Request', 'General Inquiry']" v-model="submissionType"/>
        <GeneralInquiry v-if="submissionType === 'General Inquiry'" @submit="submissionReceived = true" @missing="missing = true" />
        <ProductionRequest v-else-if="submissionType === 'Production Request'" @submit="submissionReceived = true" @missing="missing = true" />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import GeneralInquiry from "@/components/contactview/GeneralInquiry.vue";
import ProductionRequest from "@/components/contactview/ProductionRequest.vue";

const submissionReceived = ref(false);
const submissionType = ref("");
const missing = ref(false);

</script>

<style scoped lang="scss">
.icon {
  color: #00C853;
  font-size: 10em;
}

.center {
  margin-top: 100px;
  display: flex;
  justify-content: center;
}

.card {
  width: clamp(300px, 80%, 80%);
  margin-bottom: 50px;
  min-height: 500px;
  padding: 20px;
}

.list-item {
  font-weight: 300;
}
</style>
