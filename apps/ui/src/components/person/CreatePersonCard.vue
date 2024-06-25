<template>
  <v-card>
    <v-card-title>
      Create Person
    </v-card-title>
    <v-stepper v-model="step" :flat="true">
      <template #actions="{prev, next}">
        <v-stepper-header>
          <v-stepper-item :value="1" title="Person Details" :editable="step > 1" :complete="step > 1"/>
          <v-divider />
          <v-stepper-item :value="2" title="Images" :editable="step > 1" :complete="step > 2" />
          <v-divider />
          <v-stepper-item :value="3" title="Roles"  :editable="step > 1" :complete="step > 3" />
          <v-divider />
          <v-stepper-item :value="4" title="Review" subtitle="Review the data to be submitted and make sure there are no mistakes" :editable="step > 1" />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <PersonDetails :personData="personData" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <ImageTable :take="take" :images="images" :profileId="profile.id"
              @setProfile="setProfileId"
              @addImage="addImage"
            />
            <ImageRow :images="images" :profile="profile" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <RoleTable :roles="roles" :take="take" @addRole="addRole"/>
            <RolesRow :roles="roles" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <div class="review">
              <ReviewTable :images="images" :roles="roles" :profilePic="profile" :personData="personData" />
              <PriorityEditor :images="images"/>
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" prev-text="PREVIOUS" :next-text="step >= 4 ? 'CREATE' : 'NEXT'"
                   :disabled="checkDisable" />
      </template>
    </v-stepper>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ error }}</v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Person } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import {
  CreatePersonDocument,
  CreatePersonImageDocument,
  CreatePersonRoleDocument
} from "@/graphql/types";
import ImageTable from "@/components/person/PersonDetailsInput/ImageTable.vue";
import RoleTable from "@/components/person/PersonDetailsInput/RoleTable.vue";
import ReviewTable from "@/components/person/PersonDetailsInput/ReviewTable.vue";
import PersonDetails from "@/components/person/PersonDetailsInput/PersonDetails.vue";
import ImageRow from "@/components/person/PersonDetailsInput/ImageRow.vue";
import RolesRow from "@/components/person/PersonDetailsInput/RolesRow.vue";
import PriorityEditor from "@/components/person/PersonDetailsInput/PriorityEditor.vue";

const personData = ref<Partial<Person>>({
  name: "",
  description: "",
  pronouns: null,
  graduation: null,
});

const createPersonMutation = useMutation(CreatePersonDocument);
const createPersonImageMutation = useMutation(CreatePersonImageDocument);
const createPersonRoleMutation = useMutation(CreatePersonRoleDocument);

interface urlInterface {
  id: number | null,
  url: string,
  priority: 0
}

interface roleInterface {
  id: number | null,
  name: string,
  startDate?: Date,
  endDate?: Date
}

const emit = defineEmits(["save"]);

const take = 20;
const step = ref(1);
const loading = ref(false);
const error = ref<string | null>(null);
const snackbar = ref(false);
const images = ref<urlInterface[]>([]);
const roles = ref<roleInterface[]>([]);
const profile = ref<urlInterface>({
  id: null,
  url: '',
  priority: 0
});

function addImage(imageId: number, url: string) {
  images.value.push({
    id: imageId,
    url: url,
    priority: 0
  });
}

function addRole(roleId: number, name: string) {
  roles.value.push({
    id: roleId,
    name: name,
  });
}

function setProfileId(imageId: number, url: string) {
  profile.value = {
    id: imageId,
    url: url,
    priority: 0
  }
}

async function validate(next: () => void) {
  if (step.value < 4) {
    next();
    return;
  }
  let createdPerson;
  loading.value = true;
  try {
    createdPerson = await createPersonMutation.mutate({
      data: {
        name: personData.value.name,
        description: personData.value.description,
        pronouns: personData.value.pronouns,
        graduation: personData.value.graduation,
        profilePictureId: profile.value.id
      },
    });

    if (!createdPerson?.data?.person) {
      error.value = "Failed to create person";
      return;
    }

    for (const image of images.value) {
      await createPersonImageMutation.mutate({
        personId: createdPerson.data.person.id,
        imageId: image.id,
        priority: image.priority
      });
    }

    for (const role of roles.value) {
      await createPersonRoleMutation.mutate({
        personId: createdPerson.data.person.id,
        roleId: role.id,
        startTime: role.startDate,
        endTime: role.endDate
      });
    }
  } catch (e) {
    loading.value = false;
    error.value = "Failed to create person";
    snackbar.value = true;
    console.error(e);
    return;
  }
  loading.value = false;
  emit("save", createdPerson?.data?.person.id);
}

const checkDisable = computed(() => {
  if (loading.value)
    return true;
  if (step.value === 1 && !personData.value.name?.trim())
    return true;
  if (step.value === 1)
    return "prev";
  return false;
});

</script>

<style scoped lang="scss">
.review {
  display: flex;
  justify-content: space-between;
  >div {
    width: 100%;
  }
}

</style>
