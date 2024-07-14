<template>
  <v-card>
    <v-card-title>
      Create Person
    </v-card-title>
    <v-stepper v-model="step" :flat="true" :editable="validation" >
      <template #actions="{prev, next}">
        <v-stepper-header>
          <v-stepper-item :value="1" title="Person Details" :editable="true" :complete="step > 1"/>
          <v-divider />
          <v-stepper-item :value="2" title="Images"  :complete="step > 2" />
          <v-divider />
          <v-stepper-item :value="3" title="Roles" :complete="step > 3" />
          <v-divider />
          <v-stepper-item :value="4" title="Review" subtitle="Review the data to be submitted and make sure there are no mistakes" />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <v-form ref="requiredForm">
              <PersonDetails :personData="personData" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <ImageTable :take="take" :images="images" :profile="personData.profilePicture as Image"
              @setProfile="setProfile"
              @addImage="addImage"
            />
            <ImageRow :images="images" :profile="personData.profilePicture as Image" @close="personData.profilePicture = {}" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <RoleTable :roles="roles" :take="take" @addRole="addRole"/>
            <RoleRow :roles="roles" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <div class="review">
              <ReviewTable :images="images" :roles="roles" :profilePic="personData.profilePicture as Image" :personData="personData" />
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
import { computed, ref, watch } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  CreatePersonDocument,
  CreatePersonImageDocument,
  CreatePersonRoleDocument
} from "@/graphql/types";
import type { Image, Person, PersonImage, PersonRole, Role } from "@/graphql/types";
import ImageTable from "@/components/person/PersonDetailsInput/ImageTable.vue";
import RoleTable from "@/components/person/PersonDetailsInput/RoleTable.vue";
import ReviewTable from "@/components/person/PersonDetailsInput/ReviewTable.vue";
import PersonDetails from "@/components/person/PersonDetailsInput/PersonDetails.vue";
import ImageRow from "@/components/person/PersonDetailsInput/ImageRow.vue";
import RoleRow from "@/components/person/PersonDetailsInput/RoleRow.vue";
import PriorityEditor from "@/components/person/PersonDetailsInput/PriorityEditor.vue";

const personData = ref<Partial<Person>>({
  name: "",
  description: "",
  pronouns: null,
  graduation: null,
  profilePicture: {},
  profilePictureId: null,
});

const createPersonMutation = useMutation(CreatePersonDocument);
const createPersonImageMutation = useMutation(CreatePersonImageDocument);
const createPersonRoleMutation = useMutation(CreatePersonRoleDocument);

const emit = defineEmits(["save"]);

const take = 20;
const step = ref(1);
const loading = ref(false);
const error = ref<string | null>(null);
const snackbar = ref(false);
const requiredForm = ref();
const validation = ref(false);
const images = ref<PersonImage[]>([]);
const roles = ref<PersonRole[]>([]);

function setProfile(profile: Image) {
  personData.value.profilePicture = profile;
  personData.value.profilePictureId = profile.id;
}

function addImage(image: Image) {
  images.value.push({
    imageId: image.id,
    image: image,
    priority: 0
  });
}

function addRole(role: Role) {
  roles.value.push({
    roleId: role.id,
    role: role
  });
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
        profilePictureId: personData.value.profilePictureId
      },
    });

    if (!createdPerson?.data?.person) {
      error.value = "Failed to create person";
      return;
    }

    for (const image of images.value) {
      await createPersonImageMutation.mutate({
        personId: createdPerson.data.person.id,
        imageId: image.imageId,
        priority: image.priority as number
      });
    }

    for (const role of roles.value) {
      await createPersonRoleMutation.mutate({
        personId: createdPerson.data.person.id,
        roleId: role.roleId,
        startTime: role.startTime,
        endTime: role.endTime
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

watch(personData, async () => {
  if (requiredForm.value) {
    const valid = await requiredForm.value.validate();
    validation.value = valid.valid;
  }
}, {deep: true});

</script>

<style scoped lang="scss">
.review {
  display: flex;
  justify-content: space-between;
  > div {
    width: 100%;
  }
}

</style>
