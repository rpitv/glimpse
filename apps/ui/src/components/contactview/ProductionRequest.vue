<template>
  <h2 class="text-center">
    Thank you for contacting RPI TV for the recording and/or live-streaming of your event.
    Please read through the important information below prior to completing the form.
  </h2>
  <v-list class="mt-10">
    <v-list-item>
      <p class="list-item">1. We request at least two weeks notice on all requests. However, we will not
        commit to any events until a week prior, as this is the point we gauge crew availability.
        Our scheduling is generally first-come first-scheduled, so the earlier you can request
        your event’s coverage the better.  Any requests received within two weeks of the event
        date will be subject to a late request fee if RPI TV covers your event. </p>
    </v-list-item>
    <v-list-item>
      <p class="list-item">2. Please ensure your chosen facility is reserved at least two hours prior
        to your event’s start. This is to ensure our crew has sufficient setup time.  If our crew
        does not have at least two hours, it is possible we will not be set up prior to the start
        of your event. Also, it is important to have club members present at this time, to direct our
        crew as to the structuring of your event.</p>
    </v-list-item>
    <v-list-item>
      <p class="list-item">3. The services provided by RPI TV are free in most cases. However, if
        we are not able to live-stream your event or upload footage after the fact, or if you do
        not want our logo to appear in the bottom corner of the video, then a fee must be paid.
        Requests from organizations external to RPI will also be billed.</p>
    </v-list-item>
  </v-list>
  <small>* = required</small>
  <v-form class="mt-10" ref="productionRequest">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field class="mt-2" id="name" label="Your name*" v-model="name" :rules="[formRules.name]"/>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field class="mt-2" id="email" label="Your email*" type="email" v-model="email" :rules="[formRules.email]" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field class="mt-2" id="phone" label="Your phone number" type="tel" v-model="productionData.phone" :rules="[formRules.phone]" placeholder="888-888-8888"/>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field class="mt-2" id="title" label="Event title*" v-model="subject" :rules="[formRules.subject]" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field class="mt-2" id="organization" label="Organization name*" v-model="productionData.organizationName" :rules="[formRules.organization]"/>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p>Is your organization affiliated with RPI?*</p>
        <v-radio-group class="mt-2" id="affilation" v-model="productionData.schoolOrg" :rules="[formRules.affiliation]">
          <v-radio label="Yes" :value="true" />
          <v-radio label="No" :value="false" />
        </v-radio-group>
      </v-col>
      <v-col>
        <p>Would you like this event to be livestreamed?*</p>
        <v-radio-group class="mt-2" id="livestream" v-model="productionData.livestreamed" :rules="[formRules.livestream]">
          <v-radio label="Yes" :value="true" />
          <v-radio label="No" :value="false" />
        </v-radio-group>
      </v-col>
    </v-row>

    <p>Have you contacted Union Showtechs, another organization, or do you have your own audio equipment which you plan to use?*</p>
    <v-radio-group id="audio" v-model="productionData.audio.exists" :rules="[formRules.audio]">
      <v-radio label="Yes" :value="true" />
      <div v-if="productionData.audio.exists" class="ml-5">
        <p class="mt-3">Who's providing the equipment? (If the provider is not listed, you can type it in the box.)*</p>
        <v-combobox class="mt-2" id="provider" label="Select/Type the provider" :items="['Union Showtechs']"
              v-model="productionData.audio.provider" :rules="[formRules.provider]"/>
      </div>
      <v-radio label="No" :value="false" />
    </v-radio-group>
    <p>Where is your event going to take place? If off campus please include the address. (If the location is not listed, you can type it in the box.)*</p>
    <v-combobox class="mt-4" id="location" label="Select/Type the location of the event" :items="locations" clearable
                v-model="productionData.eventLocation" :rules="[formRules.location]" />

    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="5" class="text-center">
          <p class="mb-2 start-time-title">When will your event start?*</p>
          <DatePicker id="start-time" transparent color="red" mode="dateTime" :rules="timeRules" v-model="productionData.eventStartTime" :style="startTimeMissing ? {'border-color': '#E57373'} : ''" />
          <p class="ml-5" v-if="startTimeMissing"><small style="color: #E57373">Please input the start time of this event.</small></p>
        </v-col>
        <v-col cols="12" sm="12" md="5" class="text-center">
          <p class="mb-2">When do you anticipate your event concluding?*</p>
          <DatePicker id="end-time" transparent color="red" mode="dateTime" :rules="timeRules" v-model="productionData.eventEndTime" :style="endTimeMissing ? {'border-color': '#E57373'} : ''"/>
          <p class="ml-5" v-if="startTimeMissing"><small style="color: #E57373">Please input the end time of this event.</small></p>
        </v-col>
      </v-row>
    </v-container>
    <p class="mt-2">Include any details that we may need or would help us.</p>
    <v-textarea class="mt-2" label="Type any additional details here" v-model="body"
          placeholder="Example 1: We plan on showing something on a projector and would like it to be shown on your stream.
Example 2: Here's a timeline of the event for you to follow: <Insert Link Here>."
    />
    <v-btn class="text-caption mt-5" @click="submitProductionReq" color="green-accent-4" :disabled="loading">Submit</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import { DatePicker } from "v-calendar";
import { VForm } from "vuetify/components";
import { useMutation } from "@vue/apollo-composable";
import { CreateContactSubmissionProductionRequestDocument } from "@/graphql/types";
import { useGoTo } from "vuetify";

const createProductionRequest = useMutation(CreateContactSubmissionProductionRequestDocument);

const emit = defineEmits(['submit', 'missing']);

const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const loading = ref(false);
const name = ref("");
const subject = ref("");
const email = ref("");
const body = ref("");
const productionRequest = ref<VForm>();
const goTo = useGoTo();

const productionData = ref({
  organizationName: "",
  schoolOrg: null,
  phone: "",
  audio: {
    exists: null,
    provider: ""
  },
  eventLocation: "",
  eventStartTime: new Date().setSeconds(0),
  eventEndTime: new Date().setSeconds(0),
  additionalDetails: "",
  livestreamed: null,
});

const locations = ['Academy Hall Auditorium', 'CBIS Auditorium',
  'Chapel + Cultural Center', 'DCC 308', 'DCC 318', 'ECAV Arena',
  'ECAV Stadium', 'EMPAC (other)', 'EMPAC Concert Hall', 'EMPAC Theatre',
  'Hilton Garden Inn of Troy', 'Houston Field House',
  'Rensselaer Union McNeil Room', 'West Hall Auditorium'];

const formRules = {
  name: (value: string) => {
    if (value?.length > 100) return "Name can not be more than 100 characters";
    if (value?.length > 0) return true;
    return "Name can not be empty"
  },
  email: (value: string) => {
    if (value?.length === 0) return "Email can not be empty";
    if (value?.length > 300) return "Email can not be more than 300 characters";
    // Regex expression to check for a valid email address
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim.test(value))
      return true;
    return "Email address is not valid";
  },
  body: (value: string) => {
    if (value?.length > 1000) return "The inquiry must be less than 1000 characters long.";
    if (value?.length >= 15) return true;
    return "The inquiry must be at least 15 characters long.";
  },
  organization: (value: string) => {
    if (value) return true;
    return "Please enter the organization you are from";
  },
  phone: (value: string) => {
    if (value?.length === 0) return true;
    // Regex expression to check for a valid phone number
    if (/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/gim.test(value)) return true;
    return "Phone number is not valid";
  },
  request: (value: string[]) => {
    if (value) return true;
    return "Please state your request.";
  },
  audio: (value: boolean) => {
    if (value === false || value === true) return true;
    return "Please choose if you have audio equipment or not.";
  },
  provider: (value: string) => {
    if (value || !productionData.value.audio.exists) return true;
    return "Please tell us who is providing the equipment.";
  },
  location: (value: string) => {
    if (value) return true;
    return "Please tell us the location of this event.";
  },
  subject: (value: string) => {
    if (value?.length > 100) return "The event name must be less than 100 characters long";
    if (value?.length >= 5) return true;
    return "The name of your event should be at least 5 characters long.";
  },
  affiliation: (value: boolean) => {
    if (value === false || value === true) return true;
    return "Please choose if you are affiliated with RPI or not.";
  },
  livestream: (value: boolean) => {
    if (value === false || value === true) return true;
    return "Please choose if you want this event to be livestreamed or not.";
  },
}

const timeRules =  {
  minutes: { interval: 15 }
}

async function submitProductionReq() {
  const validation = await productionRequest.value?.validate();
  if (!productionData.value.eventStartTime) startTimeMissing.value = true;
  if (!productionData.value.eventEndTime) endTimeMissing.value = true;
  if (!validation?.valid || startTimeMissing.value || endTimeMissing.value) {
    if (!validation?.valid)
      goTo(`#${validation?.errors[0].id}`, { easing: "easeInOutCubic", offset: -100, duration: 500});
    emit('missing');
    return;
  }
  loading.value = true;
  try {
    const submission = await createProductionRequest.mutate({
      data: {
        audioSource: productionData.value.audio.exists ? productionData.value.audio.provider : null,
        body: body.value,
        email: email.value,
        endTime: productionData.value.eventEndTime,
        isStudentOrganization: productionData.value.schoolOrg as unknown as boolean,
        livestreamed: productionData.value.livestreamed as unknown as boolean,
        location: productionData.value.eventLocation,
        name: name.value,
        organizationName: productionData.value.organizationName,
        phoneNumber: productionData.value.phone,
        startTime: productionData.value.eventStartTime,
        subject: subject.value,
      }
    });
    emit('submit');
  } catch(e) {
    console.error(e);
  }
  loading.value = false;
}

watch(productionData.value, () => {
  if (productionData.value.eventStartTime && startTimeMissing.value)
    startTimeMissing.value = false;
  if (productionData.value.eventEndTime && endTimeMissing.value)
    startTimeMissing.value = false;
})

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
}

.form {
  padding: 10px 20px;
}

.list-item {
  font-weight: 300;
}

// Specifically at 1162px, the end time title line breaks into two lines.
// We want to push the start time box downward to match it until the break point of 960px
.start-time-title {
  @media(min-width: 960px) and (max-width: 1162px) {
    margin-bottom: 35px !important;
  }
}
</style>
