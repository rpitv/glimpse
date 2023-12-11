<template>
  <v-card min-height="500">
    <v-card-title>
      Viewing Submission {{ props.id }}
    </v-card-title>
    <div v-if="submission.loading.value" style="justify-content: center; text-align: center; align-items: center">
      <div>
        <v-progress-circular color="error" indeterminate></v-progress-circular>
        <h2>Loading...</h2>
      </div>
    </div>
    <div v-else-if="submission.result.value?.submissionDetails?.subject === 'Production Request'">
      <ProductionRequest :production="submission.result.value.submissionDetails" />
    </div>
    <div v-else-if="submission.result.value?.submissionDetails?.subject === 'General Inquiry'">
      <GeneralInquiry :inquiry="submission.result.value.submissionDetails"/>
    </div>
    <v-card-actions>
      <v-spacer/>
      <v-dialog max-width="700px" scrim="black">
        <template #activator="{ props }">
          <v-btn variant="outlined" v-bind="props" :disabled="!canResolve" color="light-blue-lighten-1">
            {{`${submission.result.value?.submissionDetails?.resolved ? 'Unr' : 'R'}esolve Submission`}}
          </v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card :title="`${submission.result.value?.submissionDetails?.resolved ? 'Unr' : 'R'}esolve Submission`">
            <v-card-text>
              Are you sure you want to resolve the submission from "{{ submission.result.value?.submissionDetails?.name }}"? This will also remove its members.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
              <v-btn v-if="!submission.result.value?.submissionDetails?.resolved" @click="resolveSubmission" variant="outlined"
                     text="Resolve" color="light-blue-lighten-1" :disabled="isResolving" />
              <v-btn v-if="submission.result.value?.submissionDetails?.resolved" @click="unresolveSubmission" variant="outlined"
                     text="Unresolve" color="light-blue-lighten-1" :disabled="isResolving" />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {useMutation, useQuery} from "@vue/apollo-composable";
import {AbilitySubjects, ContactSubmissionDetailsDocument, ResolveContactSubmissionDocument} from "@/graphql/types";
import ProductionRequest from "@/components/contactsubmissions/ProductionRequest.vue";
import GeneralInquiry from "@/components/contactsubmissions/GeneralInquiry.vue";
import {ability, AbilityActions} from "@/casl";
import {subject} from "@casl/ability";
import {ref} from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

const emit = defineEmits(['save']);

const isResolving = ref(false);

const submission = useQuery(ContactSubmissionDetailsDocument, {
  id: props.id
});

const resolver = useMutation(ResolveContactSubmissionDocument);

function canResolve() {
  return ability.can(AbilityActions.Update, subject(AbilitySubjects.ContactSubmission, {
    id: submission.result.value?.submissionDetails?.id,
    subject: submission.result.value?.submissionDetails?.subject
  }));
}

async function resolveSubmission() {
  isResolving.value = true;
  try {
    await resolver.mutate({
      id: props.id,
      resolve: true
    });
    emit('save');
  } catch (e) {
    console.error(e);
  }
  isResolving.value = false;
}

async function unresolveSubmission() {
  isResolving.value = true;
  try {
    await resolver.mutate({
      id: props.id,
      resolve: false
    });
    emit('save');
  } catch (e) {
    console.error(e);
  }
  isResolving.value = false;
}


</script>

<style scoped lang="scss">

</style>
