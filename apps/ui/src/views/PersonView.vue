<template>
  <div>
    <v-card class="person-card">
      <v-card-text>
        <div class="details-container">
          <v-avatar :size="200" :image="personDetails?.profilePicture?.path ?? RPITV_Logo" />
          <h1>{{ personDetails?.name }}</h1>
          <footer>{{ personDetails?.pronouns }}</footer>
          <p class="description">{{ personDetails?.description }}</p>
          <v-dialog width="1100">
            <template #activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps">View Photos</v-btn>
            </template>
            <template #default>
              <v-card>
                <v-card-text>
                  
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
          <br>
          <h2>Club Positions</h2>
          <div class="roles">
            <div class="text-center" v-for="role in personDetails?.roles">
              <h3 style="color: #ff6363">{{ role.role?.name }}</h3>
              <h4>{{ moment(role.startTime).format("LL") }}</h4>
              <div v-if="role.endTime">
                -
                <h4>{{ moment(role.endTime).format("LL") }}</h4>
              </div>
            </div>
          </div>
          <h2 class="mt-12" v-if="creditsDetails.length">Productions</h2>
          <v-infinite-scroll style="width: 100%" direction="horizontal" @load="load">
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
import {PersonDetailsDocument, FindCreditsDocument } from "@/graphql/types";
import type { Person, Credit } from "@/graphql/types";
import RPITV_Logo from "../assets/rpitv_logo.svg";
import moment from "moment";
import ProductionCard from "@/components/ProductionCard.vue";

const route = useRoute();

const take = 20;
let skip = 0;
let totalProductions = 0;
const personDetails = ref<Person>();
const creditsDetails = ref<Credit[]>([]);
const personData = useQuery(PersonDetailsDocument, {
  id: route.params.id
});
const creditsData = useQuery(FindCreditsDocument, {
  personId: parseFloat(route.params.id as string),
  pagination: {
    take: take,
    skip: skip
  }
});

personData.onResult((result) => {
  if (result.loading) return;
  if (result.data) {
    personDetails.value = structuredClone(result.data.person) as Person;
  }
});

async function load(load: { done: (status: 'loading' | 'error' | 'empty' | 'ok') => void }) {
  try {
    await creditsData.refetch({
      personId: parseInt(route.params.id as string),
      pagination: {
        take: take,
        skip: skip
      }
    });
    totalProductions = creditsData.result.value?.creditCount ?? 0;
    if (creditsData.result.value)
      for (const credit of creditsData.result.value.credits)
        creditsDetails.value.push(credit);

    if (skip >= creditsDetails.value.length && creditsDetails.value.length !== 0)
      skip -= take;
    if (totalProductions <= creditsDetails.value.length)
      load.done('empty');
    else {
      load.done('ok');
      skip = skip + take;
    }
  } catch (e) {
    console.error(e);
    load.done('error');
  }
}


</script>

<style scoped lang="scss">
.person-card {
  margin: 5% 10%;
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
