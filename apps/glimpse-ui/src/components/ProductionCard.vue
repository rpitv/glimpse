<template>
  <RouterLink :to="productionUrl">
    <n-card class="production-card" :title="props.name">
      <template #cover>
        <n-image class="production-thumbnail"
                 :src="props.thumbnailUrl"
                 preview-disabled
                 fallback-src="/default_thumbnail_300.png"
                 object-fit="cover"
        ></n-image>
      </template>
      <p class="production-description">{{ props.description }}</p>
      <small class="production-date">{{ moment(props.startTime).format("YYYY-MM-DD HH:mm:ss") }}</small>
    </n-card>
  </RouterLink>
</template>

<script setup lang="ts">
import moment from "moment";
import {NCard, NImage} from "naive-ui";

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
