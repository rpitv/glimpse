<template>
  <div>
    <v-card class="person-card">
      <v-card-text>
        <div v-if="personData.loading.value && personData.result.value" class="loading">
          <v-progress-circular size="80" indeterminate color="red-lighten-1" />
          <p>Loading...</p>
        </div>
        <div v-else class="details-container">
          <v-avatar :size="200" :image="personDetails?.profilePicture?.path ?? RPITV_Logo" />
          <h1>{{ personDetails?.name }}</h1>
          <footer>{{ personDetails?.pronouns }}</footer>
          <p class="description">{{ personDetails?.description }}</p>
          <v-dialog v-if="personImageData.result.value?.personImageCount" width="1100">
            <template #activator="{ props: activatorProps }">
              <v-btn class="mt-7" @click="imageDetails = []" v-bind="activatorProps">View Photos</v-btn>
            </template>
            <template #default>
              <PersonImageCard :personId="route.params.id as string" />
            </template>
          </v-dialog>
          <h2 class="mt-5">Club Positions</h2>
          <div class="roles">
            <div class="text-center" v-for="role in personDetails?.roles">
              <h3 style="color: #ff6363">{{ role.role?.name }}</h3>
              <h4>{{ moment(role.startTime).format("LL") }}</h4>
                -
              <h4>{{ role.endTime ? moment(role.endTime).format("LL") : "Present" }}</h4>
            </div>
          </div>
          <h2 class="mt-12" v-if="creditsDetails.length">Productions</h2>
          <v-infinite-scroll style="width: 100%" direction="horizontal" @load="loadProductions">
            <div class="productions">
              <template v-for="(credit, i) in creditsDetails" :key="i">
                <ProductionCard :id="credit.production?.id" :startTime="new Date(credit.production?.startTime)"
                  :description="credit.production?.description?.length ? credit.production?.description : ''"
                  :name="credit.production?.name as string" />
              </template>
            </div>
            <template #empty>
            </template>
            <template #loading>
            </template>
          </v-infinite-scroll>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import {
  FindOnePersonDocument,
  FindCreditsDocument,
  FindPersonImageDocument,
} from "@/graphql/types";
import type { Person, Credit, PersonImage, OrderDirection, PersonImageOrderableFields } from "@/graphql/types";
import RPITV_Logo from "../assets/rpitv_logo.svg";
import moment from "moment";
import ProductionCard from "@/components/ProductionCard.vue";
import PersonImageCard from "@/components/PersonImageCard.vue";

const route = useRoute();

const take = 20;
let productionSkip = 0;
let imageSkip = 0;
let totalProductions = 0;
const personDetails = ref<Person>();
const creditsDetails = ref<Credit[]>([]);
const imageDetails = ref<PersonImage[]>([]);
const personData = useQuery(FindOnePersonDocument, {
  id: route.params.id
});
const creditsData = useQuery(FindCreditsDocument, {
  personId: parseFloat(route.params.id as string),
  pagination: {
    take: 0,
    skip: productionSkip
  }
});
const personImageData = useQuery(FindPersonImageDocument, {
  filter: {
    personId: {
      equals: parseFloat(route.params.id as string)
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

personData.onResult((result) => {
  if (result.loading) return;
  if (result.data) {
    personDetails.value = structuredClone(result.data.person) as Person;
  }
});


async function loadProductions(load: { done: (status: 'loading' | 'error' | 'empty' | 'ok') => void }) {
  try {
    await creditsData.refetch({
      personId: parseInt(route.params.id as string),
      pagination: {
        take: take,
        skip: productionSkip
      }
    });
    totalProductions = creditsData.result.value?.creditCount ?? 0;
    if (creditsData.result.value)
      for (const credit of creditsData.result.value.credits)
        creditsDetails.value.push(credit);

    if (productionSkip >= creditsDetails.value.length && creditsDetails.value.length !== 0)
      productionSkip -= take;
    if (totalProductions <= creditsDetails.value.length) {
      load.done('empty');
    }
    else {
      load.done('ok');
      productionSkip += take;
    }
  } catch (e) {
    console.error(e);
    load.done('error');
  }
}

</script>

<style scoped lang="scss">
.loading {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.person-card {
  margin: 5% 10%;
  min-height: 500px;
}

.details-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.roles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 50px;
  row-gap: 25px;
}

.description {
  font-weight: lighter;
  margin: 0 max(10px, 5%);
  font-size: 1.1em;
}

.productions {
  display: flex;
  gap: 20px;
}

h1 {
  font-size: 3em;
}

h2 {
  font-size: 2em;
}

h3 {
  font-size: 1.5em;
}

h4 {
  font-size: 1.2em;
}


</style>
