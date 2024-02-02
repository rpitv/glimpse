<template>
  <div>
    <RouterLink :to="productionUrl" class="production-card" link>
      <v-card class="production-card" variant="elevated" :hover="true" density="comfortable" ref="card">
        <v-img :src="thumbnail" :cover="true" :aspect-ratio="1.7778">
          <template v-slot:placeholder>
            <v-skeleton-loader type="image" />
          </template>
          <template v-slot:error>
            <v-img src="/default_thumbnail_300.png" :cover="true" />
          </template>
        </v-img>
          <v-tooltip :text="props.name" location="bottom">
            <template v-slot:activator="{ props: tooltipProps }">
              <v-card-title v-bind="tooltipProps">
              {{props.name}}
              </v-card-title>
            </template>
          </v-tooltip>
        <v-card-text>
          <p class="production-description text-body-2">{{ props.description }}</p>
          <br>
          <div style="display: flex">
            <small class="production-date">{{ moment(props.startTime).format("llll") }}</small>
            <v-spacer />
            <small v-if="props.endTime && props.startTime < new Date() && props.endTime > new Date()" style="color: #FF7878">LIVE</small>
            <small v-else-if="props.startTime > new Date()" style="color: #64B1FF">UPCOMING</small>
          </div>
        </v-card-text>
      </v-card>
    </RouterLink>
  </div>
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
  endTime: {
    type: Date,
    required: false
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
  width: 300px;
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
