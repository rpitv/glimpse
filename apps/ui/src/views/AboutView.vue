<template>
  <div class="container">
    <h1 style="font-size: 40px">About</h1>

    <div class="summary">

      <div class="video-player-wrapper">
        <iframe src="https://www.youtube.com/embed/MfzmM3EFqIY?si=Q0ovRqJmr46-NN7z" allowfullscreen class="video-player" />
      </div>

      <p>
        Founded in 2003, RPI TV is the student-run television broadcasting organization for Rensselaer Polytechnic
        Institute. We are committed to providing the best coverage of RPI sports and campus events.
      </p>

      <h2>Where to Watch Our Content</h2>
      <p>
        Our broadcasts of RPI's Men's and Women's ECAC Ice Hockey games are available for live viewing domestically
        via <a href="https://www.espn.com/watch/catalog/2c1e3eb6-667b-4e95-8820-c594ee8c7f52/ecac-hockey">ESPN+</a>,
        or internationally via <a href="https://portal.stretchinternet.com/ecachockey/">Stretch Internet</a>. After
        30 days, an on-demand copy of our coverage will be publicly available on our
        <a href="https://www.youtube.com/@rpi-tv" target="_blank">YouTube channel</a>.
      </p>
      <p>
        All other campus and sporting events which we cover live can be found on our YouTube channel. We do our best
        to cover as many sporting events as possible. Be sure to check the latest schedule on the
        <a href="https://rpiathletics.com/">RPI Athletics website</a> to see if we will be covering a game.
      </p>
    </div>

    <h2>Meet the Team</h2>
    <p class="font-italic">Todo</p>

    <h2>Resources</h2>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          RPI TV Constitution
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <Markdown class="about-page-constitution-text">{{ Constitution }}</Markdown>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import Markdown from "@/components/util/Markdown.vue";
import Constitution from "@/assets/constitution.md?raw"
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.container {
  margin: auto;
  max-width: 1500px;
  padding: 30px;
}

.summary p {
  font-size: 1.25em;
  margin-bottom: 2em;
}

.video-player-wrapper {
  .video-player {
    aspect-ratio: 16 / 9;
    width: 100%;
    border: 0;
  }

  // Video player is full-size, top of screen on mobile devices, but text wraps around it on larger devices
  @media (min-width: map-get(settings.$grid-breakpoints, 'sm')) {
    float: right;
    width: 50%;
    min-width: min(100%, 300px);
  }
}
</style>

<style lang="scss">

.about-page-constitution-text {
  * {
    padding: 5px 0;
  }
}
</style>
