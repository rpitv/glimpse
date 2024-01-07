<template>
  <div>
    <h2>Production Details</h2>
    <v-table height="500"  class="table">
      <tbody>
        <tr>
          <td>Production Name</td>
          <td>{{ productionData.name }}</td>
        </tr>
        <tr>
          <td>Closet Location</td>
          <td>{{ productionData.closetLocation }}</td>
        </tr>
        <tr>
          <td>Event Location</td>
          <td>{{ productionData.eventLocation }}</td>
        </tr>
        <tr>
          <td>Closet Time</td>
          <td>{{ formattedTime(productionData.closetTime) }}</td>
        </tr>
        <tr>
          <td>Start Time</td>
          <td>{{ formattedTime(productionData.startTime) }}</td>
        </tr>
        <tr>
          <td>End Time</td>
          <td>{{ formattedTime(productionData.endTime) }}</td>
        </tr>
        <tr>
          <td>Tags</td>
          <td>
            <v-chip-group v-if="tags.length > 0">
              <v-chip class="ml-1" v-for="tag in tags" :key="tag">
                {{ tag }}
              </v-chip>
            </v-chip-group>
            <p v-else class="ml-1">No tags provided</p>
          </td>
        </tr>
        <tr>
          <td>Description</td>
          <td>{{ productionData.description?.length ? productionData.description : 'No description provided.'}}</td>
        </tr>
        <tr>
          <td>Team Notes</td>
          <td>{{ productionData.teamNotes?.length ? productionData.teamNotes : 'No notes provided.' }}</td>
        </tr>
        <tr>
          <td>Category</td>
          <td>
            <v-hover v-if="category.id" v-slot:default="{ isHovering, props }">
              <div v-bind="props">
                <v-chip v-if="isHovering">
                  Category Name: {{ category.name }}
                </v-chip>
                <v-chip v-else class="ml-1">
                  Category ID: {{ category.id }}
                </v-chip>
              </div>
            </v-hover>
            <p v-else>No category provided</p>
          </td>
        </tr>
        <tr>
          <td>Thumbnail</td>
          <td>
            <v-dialog width="400" scrim="black" v-if="thumbnail.id">
              <template v-slot:activator="{ props }" >
                <v-chip v-bind="props">
                  Image ID: {{ thumbnail.id }}
                </v-chip>
              </template>
              <template v-slot:default>
                <img :src="thumbnail.url">
              </template>
            </v-dialog>
            <p v-else>No thumbnail provided</p>
          </td>
        </tr>
        <tr>
          <td>Image(s)</td>
          <td>
            <v-chip-group column v-if="images.length">
              <v-dialog v-for="image in images" :key="image.id" width="400" scrim="black">
                <template v-slot:activator="{ props }">
                  <v-chip v-bind="props" >
                    Image ID: {{ image.id }}
                  </v-chip>
                </template>
                <template v-slot:default>
                  <img :src="image.url">
                </template>
              </v-dialog>
            </v-chip-group>
            <p v-else>No images provided.</p>
          </td>
        </tr>
        <tr>
          <td>Video(s)</td>
          <td>
            <v-chip-group v-if="videos.length > 0">
              <v-chip v-for="video in videos" :key="video.id" @click="openURL(video.url)">
                Video ID: {{ video.id }}
              </v-chip>
            </v-chip-group>
            <p v-else class="ml-1">No videos provided.</p>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">

import type {PropType} from "vue";
import type {Production} from "@/graphql/types";

interface urlInterface {
  id: string,
  url: string,
  priority: number,
}

const props = defineProps({
  productionData: {
    type: Object as PropType<Partial<Production>>,
    required: true
  },
  category: {
    type: Object as PropType<{id: '', name: ''}>,
    required: true
  },
  thumbnail: {
    type: Object as PropType<urlInterface>,
    required: true
  },
  tags: {
    type: Object as PropType<string[]>,
    required: true
  },
  images: {
    type: Object as PropType<urlInterface[]>,
    required: true
  },
  videos: {
    type: Object as PropType<urlInterface[]>,
    required: true
  }
});

function openURL(url: string) {
  window.open(url.replace("embed/", "watch?v="), '_blank', 'noreferrer')
}

function formattedTime(time: string) {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
  border-radius: 5px;
}
</style>
