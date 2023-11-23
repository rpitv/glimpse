<template>
<!--  Height is at 1% because it somehow prevents the anchor tag from extending past the card-->
  <RouterLink :to="productionUrl" class="production-card" style="height: 1%" link>
    <v-card class="production-card" variant="elevated" :hover="true" density="comfortable">
      <v-img :src="thumbnail" cover />
      <v-card-title>{{props.name}}</v-card-title>
      <v-card-text>
        <p class="production-description text-body-2">{{ props.description }}</p>
        <br>
        <small class="production-date">{{ moment(props.startTime).format("llll") }}</small>
      </v-card-text>
    </v-card>
  </RouterLink>
</template>

<script setup lang="ts">
import moment from "moment";
import {computed} from "vue";

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: ""
  },
  startTime: {
    type: Date,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: false
  }
})

const productionUrl = import.meta.env.BASE_URL + "productions/" + props.id;

const thumbnail = computed(() => {
  return props.thumbnailUrl ? props.thumbnailUrl : "/default_thumbnail_300.png";
})
</script>

<style scoped lang="scss">
.production-card {
  min-width: 300px;
  display: inline-block;
}

.production-description {
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.production-thumbnail {
  width: 100%;
  height: calc(300px * 9 / 16);
}
</style>
