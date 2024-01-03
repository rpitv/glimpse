<template>
  <div class="container">
    <h1 class="title">
      About
    </h1>
    <br>
    <div class="about">
      <h3 class="about-content">
        RPI TV is RPI's student-run, volunteer television club.
        We film various campus events and sports in an effort to
        preserve campus culture through video. Full videos of all
        the events we film can be watched for free on our <a href="https://www.youtube.com/@rpi-tv" target="_blank">youtube channel</a>.
      </h3>
      <div class="about-content">
        <iframe src="https://www.youtube.com/embed/MfzmM3EFqIY?si=Q0ovRqJmr46-NN7z" allowfullscreen class="video-player" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.about {
  display: flex;
  justify-content: space-between;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
}

.about-content {
  width: 47%;
  @media (max-width: 1000px) {
    width: 100%;
    margin-bottom: 25px;
  }
}

.video-player {
  aspect-ratio: 16 / 9;
  width: 100%;
  border: 0;
}
</style>
