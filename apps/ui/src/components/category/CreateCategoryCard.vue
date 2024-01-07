<template>
  <n-card
    class="create-category-card"
    :closable="closable || false"
    @close="emit('close')"
  >
    <h1>Create Category</h1>
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
          <CategoryDetailsInput
            @keypress.enter="enterKeyPressed"
            v-model:data="categoryData"
            ref="categoryDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2">
          <h2>Category Details</h2>
          <p>Name: {{ categoryData.name }}</p>
          <p>Priority: {{ categoryData.priority }}</p>
          <p>Parent: {{ categoryParent }}</p>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating category...</p>
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
        {{ currentStep >= steps.length ? "Create Category" : "Continue" }}
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
  NAlert,
} from "naive-ui";
import { computed, ref } from "vue";
import type { Category } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import { CreateCategoryDocument } from "@/graphql/types";
import { useRouter } from "vue-router";
import CategoryDetailsInput from "@/components/category/CategoryDetailsInput.vue";

const router = useRouter();
const createCategoryMutation = useMutation(CreateCategoryDocument);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "Category Details",
    description: "Enter the Category's primary details",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const categoryDetailsInput = ref<CategoryDetailsInput | null>(null);
const categoryData = ref<Partial<Category>>({
  name: "",
  priority: 0,
  parentId: null,
});

const categoryParent = computed<string>(() => {
  if (categoryData.value.parent?.name && categoryData.value.parent?.id) {
    return `${categoryData.value.parent.name} (ID ${categoryData.value.parent.id})`;
  } else if (categoryData.value.parent?.name) {
    return categoryData.value.parent.name;
  } else if (categoryData.value.parent?.id) {
    return `ID ${categoryData.value.parent.id}`;
  } else if (categoryData.value.parentId) {
    return `ID ${categoryData.value.parentId}`;
  } else {
    return "None";
  }
});

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return categoryDetailsInput.value?.isValid;
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
    let createdCategory;
    try {
      createdCategory = await createCategoryMutation.mutate({
        data: {
          name: categoryData.value.name,
          priority: categoryData.value.priority,
          parentId: categoryData.value.parentId,
        },
      });

      if (!createdCategory?.data?.category) {
        error.value = "Failed to create category";
        return;
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create category";
      return;
    }

    emit("save", createdCategory?.data?.category.id);
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

.category-tag {
  margin-bottom: 1em;
  margin-right: 1em;
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
