<template>
  <div class="container">
    <div class="about-wrapper">
      <h1>We are RPI TV.</h1>
      <p>
        RPI TV is a student-run organization at Rensselaer Polytechnic
        Institute dedicated to providing the best television broadcasts
        of RPI events.
      </p>
    </div>

    <n-grid x-gap="2" :cols="2">
      <n-gi cols="12" sm="6">
        <h1 class="item-header">Catch our next livestream:</h1>
        <!--<NextLivestream />-->
      </n-gi>
      <n-gi cols="12" sm="6">
        <h1 class="item-header">Our recent productions:</h1>
        <!--<RecentProductionsList />-->
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { NGrid, NGi } from "naive-ui";
</script>

<style scoped lang="scss">
.item-header {
  text-align: center;
}

.about-wrapper {
  width: 100%;
  text-align: center;

  h1 {
    font-size: 40px;
    margin-bottom: 20px;
  }

  p {
    font-size: 20px;
    font-weight: 300;
    display: inline-block;
    max-width: 600px;
  }
}
</style>
