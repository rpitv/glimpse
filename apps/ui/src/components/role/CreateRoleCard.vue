<template>
  <n-card
    class="create-role-card scaled-card"
    :closable="closable || false"
    @close="emit('close')"
  >
    <h1>Create Role</h1>
    <div class="steps">
      <n-steps :current="currentStep">
        <n-step
          v-for="step of steps"
          :key="step.title"
          :title="step.title"
          :description="step.description"
        />
      </n-steps>
    </div>

    <div class="step">
      <Transition name="steps">
        <div v-if="currentStep === 1">
          <RoleDetailsInput
            @keypress.enter="enterKeyPressed"
            v-model:data="roleData"
            ref="roleDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2">
          <h2>Role Details</h2>
          <n-grid cols="1 s:2" responsive="screen">
            <n-grid-item>
              <p>Name: {{ roleData.name }}</p>
              <p>Description: {{ roleData.description }}</p>
            </n-grid-item>
            <n-grid-item>
              <p>Priority: {{ roleData.priority }}</p>
              <p>
                Display in Leadership:
                {{ roleData.displayInLeadership ? "Yes" : "No" }}
              </p>
              <p>
                Display in Membership:
                {{ roleData.displayInMembership ? "Yes" : "No" }}
              </p>
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating role...</p>
        </div>
      </Transition>
    </div>

    <div class="actions">
      <n-button
        v-if="closable"
        class="action"
        @click="emit('close')"
        type="error"
        :disabled="currentStep > steps.length && !error"
      >
        Cancel
      </n-button>
      <n-button
        tertiary
        type="error"
        class="action"
        v-if="currentStep > 1"
        @click="currentStep--"
        :disabled="currentStep > steps.length && !error"
      >
        Back
      </n-button>
      <n-button
        :primary="currentStep >= steps.length"
        :tertiary="currentStep < steps.length"
        class="action"
        type="success"
        @click="nextStep"
        :disabled="!canContinue"
      >
        {{ currentStep >= steps.length ? "Create Role" : "Continue" }}
      </n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NSteps,
  NStep,
  NButton,
  NGrid,
  NGridItem,
  NAlert,
} from "naive-ui";
import { computed, ref } from "vue";
import type { Role } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import { CreateRoleDocument } from "@/graphql/types";
import { useRouter } from "vue-router";
import RoleDetailsInput from "@/components/role/RoleDetailsInput.vue";

const router = useRouter();
const createRoleMutation = useMutation(CreateRoleDocument);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "Role Details",
    description: "Enter the Role's primary details",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const roleDetailsInput = ref<RoleDetailsInput | null>(null);
const roleData = ref<Partial<Role>>({
  name: "",
  description: "",
  priority: 0,
  displayInLeadership: false,
  displayInMembership: false,
});

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return roleDetailsInput.value?.isValid;
  }
  return currentStep.value <= steps.length;
});

function enterKeyPressed() {
  if (canContinue.value) {
    nextStep();
  }
}

async function nextStep() {
  currentStep.value++;

  if (currentStep.value >= steps.length + 1) {
    let createdRole;
    try {
      createdRole = await createRoleMutation.mutate({
        data: {
          name: roleData.value.name,
          description: roleData.value.description,
          priority: roleData.value.priority,
          displayInLeadership: roleData.value.displayInLeadership,
          displayInMembership: roleData.value.displayInMembership,
        },
      });

      if (!createdRole?.data?.role) {
        error.value = "Failed to create role";
        return;
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create role";
      return;
    }

    emit("save", createdRole?.data?.role.id);
  }
}
</script>

<style scoped lang="scss">
@media (max-width: 1100px) {
  .steps {
    display: none;
  }
}

.center-text-info {
  font-size: 1.5em;
  text-align: center;
}

.step {
  margin-top: 3em;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: right;
  .action {
    margin-left: 0.5em;
  }
}
</style>
