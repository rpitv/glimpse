<template>
  <div class="card-wrapper">
    <n-card class="card">
      <div v-if="!production.loading.value">
        <ProductionCarousel :items="productionImagesAndVideos"/>
        <h1 class="prod-title">{{ production.result.value?.ReadProduction?.name }}</h1>
        <p class="prod-subtitle">{{ productionSubtitle }}</p>
        <p class="prod-description">{{ production.result.value?.ReadProduction?.description }}</p>
        <ProductionCredits :credits="production.result.value?.ReadProduction.credits"/>
        <ProductionTags
          v-if="production.result.value?.ReadProduction.tags.length > 0"
          :tags="production.result.value?.ReadProduction?.tags.map(tag => tag.tag)"
        />
      </div>
      <div v-else class="loading">
        <n-spin />
        <p>Loading...</p>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NSpin} from "naive-ui";
import {useRoute} from "vue-router";
import {useQuery} from "@vue/apollo-composable";
import {ProductionImage, ProductionVideo, ReadProductionDocument} from "@/graphql/types";
import ProductionTags from "@/components/production/ProductionTags.vue";
import ProductionCredits from "@/components/production/ProductionCredits.vue";
import ProductionCarousel from "@/components/production/ProductionCarousel.vue";
import { computed } from "vue";
import moment from "moment";
import type {DeepPartial} from "@/util/helper";

const route = useRoute();

const production = useQuery(ReadProductionDocument, {
  id: route.params.id.toString()
});

const productionImagesAndVideos = computed(() => {
  const images = production.result.value?.ReadProduction?.images?.map((prodImage: DeepPartial<ProductionImage>) => {
    return prodImage.image;
  }) ?? [];
  const videos = production.result.value?.ReadProduction?.videos?.map((prodVideo: DeepPartial<ProductionVideo>) => {
    return prodVideo.video;
  }) ?? [];

  return [...images, ...videos];
});

/**
 * Subtitle of the production. Contains the category and start date/time of the production, if available.
 *   If both are present, they are separated by a bullet point.
 */

const productionSubtitle = computed<string>(() => {
  const startTime = production.result.value?.ReadProduction?.startTime;
  const category = production.result.value?.ReadProduction?.category;

  const startTimeFormatStr = "MMMM Do YYYY, h:mm A";
  if (startTime && category) {
    return `${category.name} \u2022 ${moment(startTime).format(startTimeFormatStr)}`;
  } else if (startTime) {
    return moment(startTime).format(startTimeFormatStr);
  } else if (category) {
    return category.name || "";
  } else {
    return "";
  }
});

</script>

<style scoped lang="scss">
.card-wrapper {
  padding-top: 5em;
  display: flex;
  justify-content: center;
}
.card {
  height: 100%;
  width: 80%;
  margin-bottom: 3em;
}
.loading {
  text-align: center;
}
.prod-title, .prod-subtitle {
  margin: 0;
}

.prod-subtitle {
  font-size: 1.1em;
  font-weight: 500;
  font-style: italic;
  opacity: 75%;
}
</style>
