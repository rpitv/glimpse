<template>
  <div style="display: flex; justify-content: center;" class="mt-5">
    <div class="card-container">
      <div style="display: flex; justify-content: center" v-for="production in productions">
        <ProductionCard :id="parseInt(production.id)" style="width: 100%"
            :start-time="new Date(production.startTime)" :description="production.description" :name="production.name" :thumbnailUrl="production.thumbnail?.path" />
      </div>
    </div>
  </div>
  <div class="link">
    <router-link to="productions" style="text-decoration: none">
      <v-btn variant="outlined" class="text-caption">See More...</v-btn>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import ProductionCard from "@/components/ProductionCard.vue";
import type {Production} from "@/graphql/types";
import type {PropType} from "vue";

defineProps({
  productions: {
    type: Object as PropType<Production[]>,
    required: true
  }
})
</script>

<style scoped lang="scss">
.card-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 25px;
  @media (max-width: 700px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
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
