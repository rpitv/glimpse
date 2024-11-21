<template>
  <div>
    <div v-if="userQuery.loading.value" class="loading">
      <v-progress-circular color="#d6001c" indeterminate :size="100" :width="5">
        <p class="text-center" style="color: white" >Loading Profile...</p>
      </v-progress-circular>
    </div>
    <div v-else-if="!userData.person">
      <v-form ref="profileCreation" @submit.prevent="createProfile">
        <p>You currently do not have a profile, you can create it by entering your name below.</p>
        <v-text-field counter="100" :rules="[nameRule]" label="Name" v-model="profileName" />
        <v-btn type="submit" class="create-profile" color="green">Create Profile</v-btn>
      </v-form>
    </div>
    <div v-else>
      <h1>Profile Information</h1>
      <a :href="'/person/' + personData.id">View Profile</a>
      <div class="details">
        <p class="label">Name: <span class="info">{{ personData.name }}</span></p>
        <v-btn @click="editableValues.name.dialog = true;" variant="text" icon="fa-solid fa-pen-to-square" />
        <v-dialog :max-width="500" v-model="editableValues.name.dialog"
          @update:modelValue="(show) => { if (!show) editableValues.name.value = personData.name as string }
        ">
          <v-form ref="editableName" v-model="editableValues.name.validation" @submit.prevent="() => {
                editableName.validate();
                personData.name = editableValues.name.value;
                saveChanges('Successfully edited name', 'name');
                editableValues.name.dialog = false;
              }">
            <v-card title="Edit Name" :max-width="500">
              <template #text>
                <v-text-field validate-on="eager" :rules="[nameRule]" counter="100"
                  label="Enter your name" v-model="editableValues.name.value" />
              </template>
              <template #actions>
                <v-spacer />
                <v-btn color="green-darken-2" type="submit"
                  :disabled="personData.name === editableValues.name.value || !editableValues.name.validation">
                    SAVE
                </v-btn>
              </template>
            </v-card>
          </v-form>
        </v-dialog>
      </div>
      <div class="details">
        <p class="label">Pronouns:
          <span v-if="userData.person.pronouns?.trim().length" class="info">{{ personData.pronouns }}</span>
          <span v-else><em>No pronouns set</em></span>
        </p>
        <v-btn @click="editableValues.pronouns.dialog = true;" variant="text" icon="fa-solid fa-pen-to-square" />
        <v-dialog :max-width="500" v-model="editableValues.pronouns.dialog"
          @update:modelValue="(show) => { if (!show) editableValues.pronouns.value = personData.pronouns as string }"
        >
          <v-form ref="editablePronouns" v-model="editableValues.pronouns.validation" @submit.prevent="() => {
                  personData.pronouns = editableValues.pronouns.value;
                  saveChanges('Successfully edited pronouns', 'pronouns');
                  editableValues.pronouns.dialog = false;
                }">
            <v-card title="Edit Pronouns" :max-width="500">
              <template #text>
                <v-combobox counter="20" label="Enter your pronouns" :rules="[pronounRule]"
                 :items="pronouns" v-model="editableValues.pronouns.value" />
              </template>
              <template #actions>
                <v-spacer />
                <v-btn color="green-darken-2"
                  :disabled="personData.pronouns === editableValues.pronouns.value || !editableValues.pronouns.validation" type="submit">
                  SAVE
                </v-btn>
              </template>
            </v-card>
          </v-form>
        </v-dialog>
      </div>
      <div class="details">
        <p class="label">Graduation Date:
          <span v-if="personData.graduation" class="info">{{ moment(personData.graduation).format("LL") }}</span>
          <span v-else><em>No graduation date set</em></span>
        </p>
        <v-btn @click="editableValues.graduation.dialog = true;" variant="text" icon="fa-solid fa-pen-to-square" />
        <v-dialog :max-width="500" v-model="editableValues.graduation.dialog"
          @update:modelValue="(show) => { if (!show) editableValues.graduation.value = personData.graduation }"
        >
          <template #default>
            <v-card title="Edit Graduation Date" :max-width="500">
              <template #text>
                <v-date-input label="Enter your graduation date" v-model="editableValues.graduation.value" @click:clear="() => editableValues.graduation.value = null"  />
              </template>
              <template #actions>
                <v-spacer />
                <v-btn color="green-darken-2" :disabled="personData.graduation === editableValues.graduation.value" @click="() => {
                  personData.graduation = editableValues.graduation.value;
                  saveChanges('Successfully edited graduation date', 'graduation');
                  editableValues.graduation.dialog = false;
                }">SAVE</v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </div>
      <div class="details">
        <p class="label">Description:
	        <Markdown class="info" v-if="personData.description">
		        {{ personData.description }}
	        </Markdown>
          <span v-else><em>No description provided</em></span>
        </p>
        <v-btn @click="editableValues.description.dialog = true;" variant="text" icon="fa-solid fa-pen-to-square" />
        <v-dialog :max-width="600" v-model="editableValues.description.dialog"
                  @update:modelValue="(show) => { if (!show) editableValues.description.value = personData.description as string }"
        >
          <template #default>
            <v-card title="Edit Description" :max-width="600">
              <template #text>
                <v-textarea label="Enter your description" v-model="editableValues.description.value"  />
              </template>
              <template #actions>
                <v-spacer />
                <v-btn color="green-darken-2" :disabled="personData.description === editableValues.description.value" @click="() => {
                  personData.description = editableValues.description.value;
                  saveChanges('Successfully edited description', 'description');
                  editableValues.description.dialog = false;
                }">SAVE</v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </div>
    <v-snackbar :color="snackbarColor" v-model="snackbar" :timeout="3000">
      {{ snackbarText}}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { GenerateOwnPersonDocument, UpdatePersonDocument, UserDetailsDocument } from "@/graphql/types";
import type { Person, User } from "@/graphql/types";
import moment from "moment";
import Markdown from "@/components/util/Markdown.vue";

const auth = useAuthStore();
const generatePerson = useMutation(GenerateOwnPersonDocument);
const mutatePerson = useMutation(UpdatePersonDocument);

const userId = ref<number|null>(await auth.getOwnId());
const userData = ref<User>({});
const personData = ref<Person>({});
const profileCreation = ref();
const editableName = ref();
const editablePronouns = ref();

const profileName = ref<string>("");
const editableValues = ref({
  name: {
    dialog: false,
    value: "",
    validation: false
  },
  pronouns: {
    dialog: false,
    value: "",
    validation: false
  },
  graduation: {
    dialog: false,
    value: "",
    validation: false
  },
  description: {
    dialog: false,
    value: "",
    validation: false
  }
});
const pronouns = ["he/him", "she/her", "they/them"];
const nameRule = (v: string) => {
  if (!(v.trim()))
    return "Name is required";
  if (v.trim().length <= 100)
    return true;
  return "Name must be no more than 100 characters long";
};

const pronounRule = (v: string) => {
  if (v.trim().length <= 20)
    return true;
  return "Pronouns must be no more than 20 characters long";
};

const snackbar = ref(false);
const snackbarColor = ref("green");
const snackbarText = ref("");

async function createProfile() {
  await profileCreation.value.validate();
  if (profileName.value.trim()) {
    try {
      await generatePerson.mutate({
        name: profileName.value
      });
      snackbar.value = true;
      snackbarColor.value = "green";
      snackbarText.value = "Success"
    } catch (e) {
      console.error(e);
      snackbar.value = true;
      snackbarColor.value = "red";
      snackbarText.value = "An error has occurred";
    }
    userQuery.refetch();
  }
}
const userQuery = useQuery(UserDetailsDocument, {
  id: userId.value
});


userQuery.onResult((result) => {
  if (result.data) {
    userData.value = structuredClone(result.data.user) as User;
    if (result.data.user?.person) {
      personData.value = structuredClone(result.data.user.person);
      // Dates in the DB are UTC, Dates are converted into UTC-4, so we need to convert them back to UTC.
      if (personData.value.graduation) {
        personData.value.graduation = new Date(personData.value.graduation);
        const userTimezoneOffset = personData.value.graduation.getTimezoneOffset() * 60000;
        personData.value.graduation = new Date(personData.value.graduation.getTime() + userTimezoneOffset);
      }
      editableValues.value.name.value = personData.value.name as string;
      editableValues.value.pronouns.value = personData.value.pronouns as string;
      editableValues.value.graduation.value = personData.value.graduation;
      editableValues.value.description.value = personData.value.description as string;
    }
  }
});

async function saveChanges(text: string, field: keyof Person) {
  const data: Person = {}
  data[field] = personData.value[field];

  await mutatePerson.mutate({
    id: personData.value.id,
    data: data
  }).catch((err) => {
    console.error(err);
    snackbar.value = true;
    snackbarColor.value = "red";
    snackbarText.value = "An error has occurred";
    return;
  })
  snackbar.value = true;
  snackbarColor.value = "green";
  snackbarText.value = text;
  userQuery.refetch();
}

onMounted(() => {
  userQuery.refetch();
});

</script>

<style scoped lang="scss">
.create-profile {
  float: right;
}

.loading {
  display: flex;
  justify-content: center;
  height: clamp(300px, 30vh, 800px);
  align-items: center;
}

.details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  color: #a4a4a4;
}

.info {
  color: white;
}
</style>
