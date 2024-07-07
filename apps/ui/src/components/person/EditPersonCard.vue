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
    <v-stepper v-model="step" :flat="true" v-else>
      <template #actions="{prev, next}">
        <v-stepper-header>
          <v-stepper-item :value="1" title="Person Details"  :editable="true" :complete="step > 1"/>
          <v-divider />
          <v-stepper-item :value="2" title="Images" :editable="step > 1" :complete="step > 2" />
          <v-divider />
          <v-stepper-item :value="3" title="Roles" :editable="step > 1" :complete="step > 3" />
          <v-divider />
          <v-stepper-item :value="4" title="Review" subtitle="Review the data to be submitted and make sure there are no mistakes" :editable="step > 1" />
          <v-divider />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <PersonDetails :personData="personData" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <ImageTable :take="take" :images="newImages" :profileId="profile.id"
                @setProfile="setProfileId"
                @addImage="addImage"
            />
            <ImageRow :images="newImages" :profile="profile" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <RoleTable :roles="newRoles" :take="take" @addRole="addRole" />
            <RoleRow :roles="newRoles" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <div class="review">
              <ReviewTable :images="newImages" :roles="newRoles" :profilePic="profile" :personData="personData" />
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
import type { PropType } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import type { Person } from "@/graphql/types";
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
import { ref, computed, onMounted } from "vue";
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
const snackbar = ref(false);
const data = useQuery(PersonDetailsDocument, { id: props.personId });
const updatePersonMutation = useMutation(UpdatePersonDocument);
const createPersonImage = useMutation(CreatePersonImageDocument);
const deletePersonImage = useMutation(DeletePersonImageDocument);
const updatePersonImage = useMutation(UpdatePersonImageDocument);
const createPersonRole = useMutation(CreatePersonRoleDocument);
const deletePersonRole = useMutation(DeletePersonRoleDocument);
const updatePersonRole = useMutation(UpdatePersonRoleDocument);

interface imageInterface {
  id: number | null,
  url: string,
  priority?: number,
  personImageId?: number
}

interface roleInterface {
  id: number | null,
  name: string,
  startDate?: Date,
  endDate?: Date,
  personRoleId?: number
}

const personData = ref<Partial<Person>>({
  name: "",
  description: "",
  pronouns: null,
  graduation: null,
});

const oldImages = ref<imageInterface[]>([]);
const newImages = ref<imageInterface[]>([]);
const profile = ref<imageInterface>({
  id: null,
  url: '',
});
const oldRoles = ref<roleInterface[]>([]);
const newRoles = ref<roleInterface[]>([]);

data.onResult((result) => {
  if (result.loading) return;
  const person = result.data.person;
  personData.value = {
    name: person?.name,
    description: person?.description,
    pronouns: person?.pronouns,
    graduation: person?.graduation,
  };
  profile.value = {
    id: person?.profilePicture?.id,
    url: person?.profilePicture?.path as string,
    priority: 0
  }
  oldImages.value = person?.images?.map((image) => { return {
    id: image.image?.id, url: image.image?.path, priority: image.priority, personImageId: image.id
  }});
  newImages.value = person?.images?.map((image) => { return {
    id: image.image?.id, url: image.image?.path, priority: image.priority, personImageId: image.id
  }});
  oldRoles.value = person?.roles?.map((role) => { return {
    id: role.role?.id, name: role.role?.name, startDate: role.startTime, endDate: role.endTime, personRoleId: role.id
  }})
  newRoles.value = person?.roles?.map((role) => { return {
    id: role.role?.id, name: role.role?.name, startDate: role.startTime, endDate: role.endTime, personRoleId: role.id
  }});
});

function addImage(imageId: number, url: string) {
  newImages.value.push({
    id: imageId,
    url: url,
    priority: 0
  });
}

function addRole(roleId: number, name: string) {
  newRoles.value.push({
    id: roleId,
    name: name,
  });
}

function setProfileId(imageId: number, url: string) {
  profile.value = {
    id: imageId,
    url: url,
  }
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
      const matchingImage = oldImages.value.find((oldImage) => oldImage.id === newImage.id);
      if (matchingImage) {
        if (matchingImage.priority !== newImage.priority) {
          updatePersonImage.mutate({
            id: matchingImage.personImageId,
            priority: newImage.priority ?? 0
          });
        }
      } else {
        createPersonImage.mutate({
          imageId: newImage.id,
          personId: props.personId,
          priority: newImage.priority ?? 0
        });
      }
    }

    for (const oldImage of oldImages.value) {
      const matchingImage = newImages.value.find((newImage) => newImage.id === oldImage.id);
      if (!matchingImage)
        deletePersonImage.mutate({
          id: oldImage.personImageId,
        });
    }

    for (const newRole of newRoles.value) {
      const matchingRole = oldRoles.value.find((oldRole) => oldRole.id === oldRole.id);
      if (matchingRole) {
        if (matchingRole.endDate !== newRole.endDate || matchingRole.startDate !== newRole.startDate) {
          updatePersonRole.mutate({
            id: newRole.id,
            startTime: newRole.startDate,
            endTime: newRole.endDate
          })
        }
      } else {
        createPersonRole.mutate({
          roleId: newRole.id,
          personId: props.personId,
          startTime: newRole.startDate,
          endTime: newRole.endDate
        });
      }
    }

    for (const oldRole of oldRoles.value) {
      const matchingRole = newRoles.value.find((newRole) => newRole.id === oldRole.id);
      if (!matchingRole) {
        deletePersonRole.mutate({
          id: oldRole.personRoleId
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
