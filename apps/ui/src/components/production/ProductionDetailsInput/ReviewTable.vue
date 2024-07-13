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
              <v-chip class="ml-1" v-for="tag in tags" :key="tag.tag">
                {{ tag.tag }}
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
            <v-chip v-tooltip="category.name" v-if="category.id" class="ml-1">
              Category ID: {{ category.id }}
            </v-chip>
            <p v-else>No category provided</p>
          </td>
        </tr>
        <tr>
          <td>Thumbnail</td>
          <td>
            <v-dialog width="400" scrim="black" v-if="thumbnail.id">
              <template v-slot:activator="{ props }" >
                <v-chip v-tooltip="'Click to view image'" v-bind="props">
                  Image ID: {{ thumbnail.id }}
                </v-chip>
              </template>
              <template v-slot:default>
                <img :src="thumbnail.path" :alt="thumbnail.name">
              </template>
            </v-dialog>
            <p v-else>No thumbnail provided</p>
          </td>
        </tr>
        <tr>
          <td>Image(s)</td>
          <td>
            <v-chip-group column v-if="images.length">
              <v-dialog v-for="image in images" :key="image.imageId" width="400" scrim="black">
                <template v-slot:activator="{ props }">
                  <v-chip v-tooltip="'Click to view image'" v-bind="props" >
                    Image ID: {{ image.imageId }}
                  </v-chip>
                </template>
                <template v-slot:default>
                  <img :src="image.image?.path" :alt="image.image?.name">
                </template>
              </v-dialog>
            </v-chip-group>
            <p v-else>No images provided.</p>
          </td>
        </tr>
        <tr>
          <td>Video(s)</td>
          <td>
            <v-chip-group column v-if="videos.length > 0">
              <v-chip v-tooltip="'Click to open video link'" v-for="video in videos" :key="video.videoId" @click="openURL(video.video?.metadata.url)">
                Video ID: {{ video.videoId }}
              </v-chip>
            </v-chip-group>
            <p v-else class="ml-1">No videos provided.</p>
          </td>
        </tr>
        <tr>
          <td>Credit(s)</td>
          <td>
            <v-chip-group column v-if="credits.length > 0">
              <v-chip v-for="credit in credits" :key="credit.personId" v-tooltip="`${credit.person?.name} ${credit.title?.trim() ? `as ${credit.title}` : '' }`" >
                Person ID: {{ credit.personId }}
              </v-chip>
            </v-chip-group>
            <p v-else class="ml-1">No credits provided.</p>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">

import type { PropType } from "vue";
import type { Category, Credit, Image, Production, ProductionImage, ProductionTag, ProductionVideo } from "@/graphql/types";

defineProps({
  productionData: {
    type: Object as PropType<Partial<Production>>,
    required: true
  },
  category: {
    type: Object as PropType<Category>,
    required: true
  },
  thumbnail: {
    type: Object as PropType<Image>,
    required: true
  },
  tags: {
    type: Object as PropType<ProductionTag[]>,
    required: true
  },
  images: {
    type: Object as PropType<ProductionImage[]>,
    required: true
  },
  videos: {
    type: Object as PropType<ProductionVideo[]>,
    required: true
  },
  credits: {
    type: Object as PropType<Credit[]>,
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
}
</style>
