<template>
  <v-card class="image-card">
    <v-card-title>
      <h1 class="text-center">Click on the images to enlarge them</h1>
    </v-card-title>
    <v-card-text>
      <v-infinite-scroll style="overflow-y: hidden" @load="loadImages">
        <div class="images">
          <template v-for="image in imageDetails" :key="image.id">
            <v-dialog class="dialog" max-width="700" width="700">
              <template #activator="{ props: activatorProps }">
                <v-img v-tooltip="image.image?.name" v-bind="activatorProps" cover :aspect-ratio="3 /2" max-width="300" width="300" :src="image.image?.path as string" />
              </template>
              <template #default>
                <v-img max-width="700" width="700" :src="image.image?.path as string" />
              </template>
            </v-dialog>
          </template>
        </div>
        <template #empty>
        </template>
        <template #loading>
        </template>
      </v-infinite-scroll>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { FindPersonImageDocument, OrderDirection, PersonImageOrderableFields } from "@/graphql/types";
import type { PersonImage } from "@/graphql/types";
import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { onMounted } from "vue";

const imageDetails = ref<PersonImage[]>([]);

const props = defineProps({
  personId: {
    type: String,
    required: true
  }
})

const take = 20;
let imageSkip = 0;
let totalImages = 0;

const personImageData = useQuery(FindPersonImageDocument, {
  filter: {
    personId: {
      equals: parseFloat(props.personId)
    }
  },
  pagination: {
    take: 0,
    skip: imageSkip,
  },
  order: {
    direction: "Asc" as OrderDirection,
    field: "priority" as PersonImageOrderableFields
  }
});

async function loadImages(load: { done: (status: 'loading' | 'error' | 'empty' | 'ok') => void }) {
  try {
    await personImageData.refetch({
      filter: {
        personId: {
          equals: parseFloat(props.personId)
        }
      },
      pagination: {
        take: take,
        skip: imageSkip,
      },
      order: {
        direction: "Asc" as OrderDirection,
        field: "priority" as PersonImageOrderableFields
      }
    });
    totalImages = personImageData.result.value?.personImageCount ?? 0;
    if (personImageData.result.value)
      for (const image of personImageData.result.value.personImages)
        imageDetails.value.push(image);
    if (imageSkip >= imageDetails.value.length && imageDetails.value.length !== 0)
      imageSkip -= take;
    if (totalImages <= imageDetails.value.length)
      load.done('empty');
    else {
      load.done('ok');
      imageSkip += take;
    }
  } catch (e) {
    console.error(e);
    load.done('error');
  }
}

onMounted(() => {
  imageDetails.value = [];
})
</script>

<style scoped lang="scss">
.image-card {
  min-height: 400px;
}

.person-image {
  height: 200px;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

</style>
