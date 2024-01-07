<template>
  <div class="card-wrapper">
    <v-card class="card" v-if="!production.loading.value">
      <ProductionCarousel :items="productionImagesAndVideos" class="carousel"/>
      <v-card-text>
        <h1 class="prod-title">{{ production.result.value?.ReadProduction?.name }}</h1>
      </v-card-text>
      <v-card-subtitle>
        <p class="prod-subtitle">{{ productionSubtitle }}</p>
      </v-card-subtitle>
      <v-card-text>
        <p class="prod-description">{{ production.result.value?.ReadProduction?.description }}</p>
        <ProductionCredits class="prod-credits" :credits="production.result.value?.ReadProduction?.credits"/>
        <div v-if="(production.result.value?.ReadProduction?.tags?.length as number) > 0">
          <h3 class="mt-5 mb-3">Tags</h3>
          <hr>
          <ProductionTags class="prod-tags"
              :tags="production.result.value?.ReadProduction?.tags?.map(tag => tag.tag) as string[]"
          />
        </div>
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
import { ReadProductionDocument } from "@/graphql/types";
import ProductionTags from "@/components/productionview/ProductionTags.vue";
import ProductionCredits from "@/components/productionview/ProductionCredits.vue";
import ProductionCarousel from "@/components/productionview/ProductionCarousel.vue";
import { computed } from "vue";
import moment from "moment";
import type {DeepPartial} from "@/util/helper";
import type { ProductionImage, ProductionVideo } from "@/graphql/types"

const route = useRoute();

const production = useQuery(ReadProductionDocument, {
  id: route.params.id.toString()
});

const productionImagesAndVideos = computed(() => {
  const images = production.result.value?.ReadProduction?.images?.map((prodImage: DeepPartial<ProductionImage>) => {
    return prodImage;
  }) ?? [];
  const videos = production.result.value?.ReadProduction?.videos?.map((prodVideo: DeepPartial<ProductionVideo>) => {
    return prodVideo;
  }) ?? [];

  const sortVideosImages = [...images, ...videos].sort((a, b) => b.priority - a.priority);

  return sortVideosImages.map((item) => item.image ?? item.video)
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
  width: 70%;
  margin-bottom: 3em;
  @media screen and (max-width: 500px) {
    width: 95%;
  }
  @media screen and (max-width: 1000px) {
    width: 85%;
  }
}
.carousel {
  aspect-ratio: 16 / 9;
}
.loading {
  text-align: center;
}

.prod-title {
  margin-bottom: -10px;
  line-height: 32px;
}

.prod-subtitle {
  font-style: italic;
  opacity: 75%;
}

.prod-description {
  font-weight: lighter;
  font-size: large;
}

.prod-credits {
  margin-top: 20px;
}

</style>
