<template>
  <div class="construction">
    <h1 class="header">Under Construction</h1>
    <FontAwesomeIcon class="icon" icon="fa-duotone fa-user-helmet-safety" />
    <p>The new RPI TV website is currently under construction. We apologize for the inconvenience!</p>
    <hr>
    <p>To watch our broadcasts, please visit our YouTube channel here: <a href="https://youtube.com/rpitv">https://youtube.com/rpitv</a></p>
    <p>For service requests or any questions or concerns, you can contact us at <a href="mailto:rpitv@union.lists.rpi.edu">rpitv@union.lists.rpi.edu</a></p>
    <p></p>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

</script>

<style scoped lang="scss">
.icon {
  font-size: 10em;
  --fa-primary-color: #ffd363;
  --fa-secondary-color: #f4fbff;
  --fa-secondary-opacity: 1.0;
}
.header {
  font-size: 3rem;
  font-weight: 600;
}
.construction {
  margin-top: 5vh;
  padding: 1em;
  text-align: center;
}
p {
  font-size: 1.3em;
}
hr {
  width: 60%;
  opacity: 0.5;
}
</style>
