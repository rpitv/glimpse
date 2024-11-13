<template>
  <div class="container text-center mt-10">
    <p>We hold weekly meetings on Tuesdays at
      9:00 PM in the Rensselaer Union, Room 3202.
      This is where we plan for the week’s
      events, as well as just hang out and have a
      good time! Food is occasionally provided.
    </p>
    <br>
    <h2><a :href="discordLink" target="_blank">Join Our Discord Server!</a></h2>
  </div>
</template>

<script setup lang="ts">
const discordLink = "https://discord.com/invite/zr6Xy8nK6E"
</script>

<style scoped lang="scss">
p {
  font-weight: lighter;
  font-size: 26px;
}
</style>
