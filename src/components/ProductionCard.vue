<template>
  <RouterLink :to="productionUrl">
    <v-card class="production-card" width="300">
      <v-img :src="thumbnail" cover />
      <v-card-title> {{props.name}}</v-card-title>
      <v-card-text>
        <p class="production-description">{{ props.description }}</p>
        <br>
        <small class="production-date">{{ moment(props.startTime).format("llll") }}</small>
      </v-card-text>
    </v-card>
  </RouterLink>
</template>

<script setup lang="ts">
import moment from "moment";
import { computed } from "vue";

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
    required: true
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
  max-width: 300px;
  display: inline-block;
}

a:hover {
  text-decoration: none;
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
