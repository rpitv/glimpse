<template>
  <div style="display: flex; flex-direction: column">
    <v-card v-for="(production, i) in productions" class="mt-5">
      <img :src="production.thumbnail?.path ? production.thumbnail?.path : '/default_thumbnail_1200.png'" style="width: 100%" >
      <v-card-title>
        {{ production.name }}
      </v-card-title>
      <v-card-text>
        <p>{{ production.description }}</p>
        <br>
        <small>{{ moment(production.startTime).format("llll") }}</small>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import ProductionCard from "@/components/ProductionCard.vue";
import {Production} from "@/graphql/types";
import type {PropType} from "vue";
import moment from "moment";

defineProps({
  productions: {
    type: Object as PropType<Production[]>,
    required: true
  }
})

</script>

<style scoped lang="scss">
.card-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.productions {
  display: flex;
  justify-content: center;
}
.link {
  display: flex;
  justify-content: center;
  margin: 10px;
}

</style>
