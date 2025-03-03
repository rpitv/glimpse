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
	        <Markdown class="description">
		        {{ personDetails?.description }}
	        </Markdown>
          <v-dialog v-if="personImageData.result.value?.personImageCount" v-model="isPersonImageDialogOpened" width="1100">
            <template #activator="{ props: activatorProps }">
              <v-btn class="mt-7" @click="imageDetails = []" v-bind="activatorProps">View Photos</v-btn>
            </template>
            <template #default>
              <PersonImageCard :personId="route.params.id as string" />
              <v-btn class="position-fixed right-0 mx-3 my-1" variant="text" icon="fal fa-xmark" @click="isPersonImageDialogOpened = false" />
            </template>
          </v-dialog>
          <h1 class="mt-5">Club Positions</h1>
          <div class="roles">
            <div class="text-center club-roles" v-for="role in personDetails?.roles">
              <p class="name" style="color: #ff6363">{{ role.role?.name }}</p>
              <p>{{ moment(role.startTime).format("LL") }}</p>
                -
              <p>{{ role.endTime ? moment(role.endTime).format("LL") : "Present" }}</p>
            </div>
          </div>
          <h1 class="mt-12" v-if="creditsDetails.length">Productions</h1>
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
import Markdown from "@/components/util/Markdown.vue";

const route = useRoute();

const take = 20;
let productionSkip = 0;
let imageSkip = 0;
let totalProductions = 0;
const personDetails = ref<Person>();
const creditsDetails = ref<Credit[]>([]);
const imageDetails = ref<PersonImage[]>([]);
const isPersonImageDialogOpened = ref<boolean>(false);
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
    personDetails.value.roles = personDetails.value.roles?.sort(
      (a, b) => {
        // Scenario where if the start time were left blank, then the api would autofill the date with the time.
        // We don't care about time so we'll need to get rid of it with date string
        const bEndTime = b.endTime ? new Date(new Date(b.endTime).toDateString()).getTime() : Number.POSITIVE_INFINITY;
        const aEndTime = a.endTime ? new Date(new Date(b.endTime).toDateString()).getTime() : Number.POSITIVE_INFINITY;
        const endTimeDiff = bEndTime - aEndTime;
        if (endTimeDiff !== 0)
          return endTimeDiff;
        // Start time cannot be null
        const startTimeDiff = new Date(new Date(b.startTime).toDateString()).getTime() - new Date(new Date(a.startTime).toDateString()).getTime();
        if (startTimeDiff !== 0)
          return startTimeDiff;
        return (b.role?.priority as number) - (a.role?.priority as number);
      });
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
	align-items: center;
}

.description {
  margin: 0 max(10px, 5%);
  text-align: center;
}

.productions {
  display: flex;
  gap: 20px;
}

h1 {
	font-size: 2rem;
}

p {
	font-size: 16px;
	font-weight: lighter;
}

.name {
	font-size: 1.5rem;
	font-weight: bold;
}

.club-roles {

	width: 250px;
}

</style>
