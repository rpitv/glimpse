<template>
  <div class="card-wrapper">
    <v-card class="card" v-if="!production.loading.value">
      <ProductionCarousel :items="productionImagesAndVideos"/>
      <v-card-text>
        <h2 class="prod-title">{{ production.result.value?.ReadProduction?.name }}</h2>
      </v-card-text>
      <v-card-subtitle>
        <p class="prod-subtitle">{{ productionSubtitle }}</p>
      </v-card-subtitle>
      <v-card-text>
        <p class="prod-description">{{ production.result.value?.ReadProduction?.description }}</p>
        <ProductionCredits class="prod-credits" :credits="production.result.value?.ReadProduction.credits"/>
        <ProductionTags class="prod-tags"
          v-if="production.result.value?.ReadProduction.tags.length > 0"
          :tags="production.result.value?.ReadProduction?.tags.map(tag => tag.tag)"
        />
      </v-card-text>
    </v-card>
    <div v-else class="loading">
      <v-progress-circular color="#ff6363" size="54" indeterminate></v-progress-circular>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  width: 95%;
  margin-bottom: 3em;
  @media screen and (min-width: 500px) {
    width: 80%;
  }
}
.loading {
  text-align: center;
}

.prod-title {
  margin-bottom: -10px;
  font-size: 23px;
}

.prod-subtitle {
  font-weight: 500;
  font-style: italic;
  opacity: 75%;
}

.prod-description {
}

.prod-credits {
  margin-top: 20px;
}

</style>
