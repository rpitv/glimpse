<template>
  <v-card>
    <v-card-title>
      Edit Person {{ personId }}
    </v-card-title>
    <div v-if="data.loading.value" class="flex-container" style="justify-content: center" >
      <div>
        <v-progress-circular color="error" indeterminate></v-progress-circular>
        <h2>Loading</h2>
      </div>
    </div>
    <v-stepper v-model="step" :flat="true" :editable="validation" v-else>
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
            <ImageTable :take="take" :images="newImages" :profile="personData.profilePicture as Image"
                @setProfile="setProfileId"
                @addImage="addImage"
            />
            <ImageRow :images="newImages" :profile="personData.profilePicture as Image" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <RoleTable :roles="newRoles" :take="take" @addRole="addRole" />
            <RoleRow :roles="newRoles" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <div class="review">
              <ReviewTable :images="newImages" :roles="newRoles" :profilePic="personData.profilePicture as Image" :personData="personData" />
              <PriorityEditor :images="newImages"/>
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" prev-text="PREVIOUS" @click:prev="prev" :next-text="step >= 4 ? 'EDIT' : 'NEXT'"
                           :disabled="checkDisable" />
      </template>
    </v-stepper>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ error }}</v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { PropType } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import type {Image, Person, PersonImage, PersonRole, Role} from "@/graphql/types";
import {
  PersonDetailsDocument,
  UpdatePersonDocument,
  CreatePersonImageDocument,
  DeletePersonImageDocument,
  UpdatePersonImageDocument,
  CreatePersonRoleDocument,
  DeletePersonRoleDocument,
  UpdatePersonRoleDocument,
} from "@/graphql/types";
import ImageTable from "@/components/person/PersonDetailsInput/ImageTable.vue";
import PersonDetails from "@/components/person/PersonDetailsInput/PersonDetails.vue";
import ImageRow from "@/components/person/PersonDetailsInput/ImageRow.vue";
import RoleRow from "@/components/person/PersonDetailsInput/RoleRow.vue";
import RoleTable from "@/components/person/PersonDetailsInput/RoleTable.vue";
import ReviewTable from "@/components/person/PersonDetailsInput/ReviewTable.vue";
import PriorityEditor from "@/components/person/PersonDetailsInput/PriorityEditor.vue";

const props = defineProps({
  personId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["save"]);

const take = 20;
const step = ref(1);
const loading = ref(false);
const error = ref<string | null>(null);
const requiredForm = ref();
const validation = ref(false);
const snackbar = ref(false);
const data = useQuery(PersonDetailsDocument, { id: props.personId });
const updatePersonMutation = useMutation(UpdatePersonDocument);
const createPersonImage = useMutation(CreatePersonImageDocument);
const deletePersonImage = useMutation(DeletePersonImageDocument);
const updatePersonImage = useMutation(UpdatePersonImageDocument);
const createPersonRole = useMutation(CreatePersonRoleDocument);
const deletePersonRole = useMutation(DeletePersonRoleDocument);
const updatePersonRole = useMutation(UpdatePersonRoleDocument);

const personData = ref<Partial<Person>>({
  description: "",
  graduation: null,
  name: "",
  profilePicture: {},
  profilePictureId: null,
  pronouns: null,
});

const oldImages = ref<PersonImage[]>([]);
const newImages = ref<PersonImage[]>([]);
const oldRoles = ref<PersonRole[]>([]);
const newRoles = ref<PersonRole[]>([]);

data.onResult((result) => {
  if (result.loading) return;
  const person = result.data.person;
  personData.value = {
    name: person?.name,
    description: person?.description,
    pronouns: person?.pronouns,
    graduation: new Date(person?.graduation),
    profilePicture: JSON.parse(JSON.stringify(person?.profilePicture)) ?? {},
    profilePictureId: person?.profilePicture?.id
  };
  oldImages.value = person?.images as PersonImage[];
  newImages.value = JSON.parse(JSON.stringify(person?.images)) as PersonImage[];
  oldRoles.value = person?.roles as PersonRole[];
  newRoles.value = JSON.parse(JSON.stringify(person?.roles)) as PersonRole[];
});

function addImage(image: Image) {
  newImages.value.push({
    imageId: image.id,
    image: image,
    priority: 0
  });
}

function addRole(role: Role) {
  newRoles.value.push({
    role: role,
    roleId: role.id,
  });
}

function setProfileId(image: Image) {
  personData.value.profilePicture = image;
  personData.value.profilePictureId = image.id;
}

async function validate(next: () => void) {
  if (step.value < 4) {
    next();
    return;
  }
  let updatedPerson;
  loading.value = true;
  try {
    updatedPerson = await updatePersonMutation.mutate({
      id: props.personId,
      data: {
        name: personData.value.name,
        description: personData.value.description,
        pronouns: personData.value.pronouns,
        graduation: personData.value.graduation,
        profilePictureId: personData.value.profilePictureId,
      },
    });

    if (!updatedPerson?.data?.person) {
      error.value = "Failed to update person";
      return;
    }

    for (const newImage of newImages.value) {
      const matchingImage = oldImages.value.find((oldImage) => oldImage.imageId === newImage.imageId);
      if (matchingImage) {
        if (matchingImage.priority !== newImage.priority) {
          updatePersonImage.mutate({
            id: matchingImage.id,
            priority: newImage.priority ?? 0
          });
        }
      } else {
        createPersonImage.mutate({
          imageId: newImage.imageId,
          personId: props.personId,
          priority: newImage.priority ?? 0
        });
      }
    }

    for (const oldImage of oldImages.value) {
      const matchingImage = newImages.value.find((newImage) => newImage.imageId === oldImage.imageId);
      if (!matchingImage)
        deletePersonImage.mutate({
          id: oldImage.id,
        });
    }

    for (const newRole of newRoles.value) {
      const matchingRole = oldRoles.value.find((oldRole) => oldRole.roleId === oldRole.roleId);
      if (matchingRole) {
        if (matchingRole.endTime !== newRole.endTime || matchingRole.startTime !== newRole.startTime) {
          updatePersonRole.mutate({
            id: newRole.id,
            startTime: newRole.startTime,
            endTime: newRole.startTime
          })
        }
      } else {
        createPersonRole.mutate({
          roleId: newRole.roleId,
          personId: props.personId,
          startTime: newRole.startTime,
          endTime: newRole.endTime
        });
      }
    }

    for (const oldRole of oldRoles.value) {
      const matchingRole = newRoles.value.find((newRole) => newRole.roleId === oldRole.roleId);
      if (!matchingRole) {
        deletePersonRole.mutate({
          id: oldRole.id
        })
      }
    }

  } catch (e) {
    loading.value = false;
    error.value = "Failed to update person";
    snackbar.value = true;
    console.error(e);
    return;
  }
  loading.value = false;
  emit("save", updatedPerson?.data?.person.id);
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

onMounted(() => {
  data.refetch();
})

</script>

<style scoped lang="scss">
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
  * {
    margin-left: 0.5em;
  }
}
.flex-container {
  display: flex;
  text-align: center;
  align-items: center;
}
.review {
  display: flex;
  justify-content: space-between;
  >div {
    width: 100%;
  }
}

</style>
