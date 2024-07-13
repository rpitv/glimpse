<template>
  <div>
    <h2>Person Details</h2>
    <v-table height="500" class="table">
      <tbody>
        <tr>
          <td>Person Name</td>
          <td>{{ personData.name }}</td>
        </tr>
        <tr>
          <td>Person Pronouns</td>
          <td>{{ personData.pronouns?.trim().length ? personData.pronouns : 'No pronouns provided.' }}</td>
        </tr>
        <tr>
          <td>Graduation Date</td>
          <td>{{ formattedDate(personData.graduation) ?? 'No graduation provided.' }}</td>
        </tr>
        <tr>
          <td>Description</td>
          <td>{{ personData.description?.trim().length ? personData.description : 'No description provided.'}}</td>
        </tr>
        <tr>
          <td>Image(s)</td>
          <td>
            <v-chip-group column v-if="images.length">
              <v-dialog v-for="image in images" :key="image.id" width="400" scrim="black">
                <template #activator="{ props }">
                  <v-chip v-bind="props" >
                    Image ID: {{ image.imageId }}
                  </v-chip>
                </template>
                <template #default>
                  <img :src="image.image?.path" :alt="image.image?.name">
                </template>
              </v-dialog>
            </v-chip-group>
            <p v-else>No images provided.</p>
          </td>
        </tr>
        <tr>
          <td>Role(s)</td>
          <td>
            <v-chip-group v-if="roles.length > 0" column>
              <v-dialog v-for="role in roles" :key="role.roleId" max-width="500">
                <template #activator="{ props }">
                  <v-chip v-bind="props">
                    {{ role.role?.name }}
                  </v-chip>
                </template>
                <template #default>
                    <v-card :title="`Start and End Dates as ${role.role?.name}`">
                      <v-card-text>
                        <v-table>
                          <tbody>
                            <tr>
                              <td>Role Start Date</td>
                              <td>{{ role.startTime ? formattedDate(role.startTime.toString()) : "No date provided." }}</td>
                            </tr>
                            <tr>
                              <td>Role End Date</td>
                              <td>{{ role.endTime ? formattedDate(role.endTime.toString()) : "No date provided." }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-card-text>
                    </v-card>
                </template>
              </v-dialog>
            </v-chip-group>
            <p v-else>No roles provided.</p>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Person, Image, PersonRole, PersonImage } from "@/graphql/types";

defineProps({
  personData: {
    type: Object as PropType<Partial<Person>>,
    required: true
  },
  profilePic: {
    type: Object as PropType<Image>,
    required: true
  },
  roles: {
    type: Object as PropType<PersonRole[]>,
    required: true
  },
  images: {
    type: Object as PropType<PersonImage[]>,
    required: true
  }
});

function formattedDate(time: string) {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
}

.dialog-card {
  width: 400px;
}
</style>
