<template>
  <footer>
    <v-row>
      <v-col :cols="display.width.value >= 556 ? 4 : 12"
             class="legal col"
             :order="display.width.value >= 556 ? 1 : 2">
        <h2>Info</h2>
        <div>
          <p><RouterLink to="privacy">Privacy Policy</RouterLink></p>
          <p><RouterLink to="accessibility">Accessibility Statement</RouterLink></p>
        </div>
      </v-col>
      <v-col :cols="display.width.value >= 556 ? 4 : 12"
             class="about col"
             :order="display.width.value >= 556 ? 2 : 1">
        <h2>About</h2>
        <p>Copyright &copy; RPI TV {{year}}</p>
        <p>
          <a href="https://github.com/rpitv/glimpse" class="github-link">
            An RCOS Project
            <FontAwesomeIcon class="github-icon icon" icon="fa-brands fa-github" />
          </a>
        </p>
        <p><RouterLink to="constitution">Constitution</RouterLink></p>
        <p><a href="https://github.com/rpitv/glimpse/wiki">Wiki</a></p>
      </v-col>
      <v-col :cols="display.width.value >= 556 ? 4 : 12" class="last-col col social" :order="3">
        <h2>Social</h2>
          <p><a href="https://www.youtube.com/@rpi-tv">
            <FontAwesomeIcon class="youtube-icon icon" icon="fa-brands fa-youtube" />
            YouTube
          </a></p>
          <p><a href="https://twitter.com/rpitv">
            <FontAwesomeIcon class="twitter-icon icon" icon="fa-brands fa-x-twitter" />
            X (Formerly Twitter)
          </a></p>
          <p><a href="https://discord.com/invite/zr6Xy8nK6E">
            <FontAwesomeIcon class="discord-icon icon" icon="fa-brands fa-discord" />
            Discord
          </a></p>
          <p><a href="https://www.instagram.com/rpitvweb/">
            <FontAwesomeIcon class="instagram-icon icon" icon="fa-brands fa-instagram" />
            Instagram
          </a></p>
          <p><a href="https://www.reddit.com/user/rpi_tv/">
            <FontAwesomeIcon class="reddit-icon icon" icon="fa-brands fa-reddit-alien" />
            Reddit
          </a></p>
          <p><a href="https://github.com/rpitv">
            <FontAwesomeIcon class="github-icon icon" icon="fa-brands fa-github" />
            GitHub
          </a></p>
      </v-col>
    </v-row>
  </footer>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDisplay } from "vuetify";

const year = new Date().getFullYear();
const display = useDisplay();
</script>

<style scoped lang="scss">
footer {
  width: 100%;
  height: 23em;
  padding: 2em;
  background-color: rgb(27, 29, 35);
  color: #a9aeb3;
  /* Not sure why this is 555px and not 500px. Look at the cols prop on n-grid */
  @media(max-width: 555px) {
    height: 46em;
  }
}

p {
  margin: 0.5em;
}

.github-link {
  display: inline-flex;
  align-items: center;
}

.col {
  padding-left: 1em;
  padding-right: 1em;
  border-right: rgba(169, 174, 179, 0.2) 1px solid;
  text-align: center;
  @media (max-width: 555px) {
    border-right: none;
  }
}
.last-col {
  border-right: none;
}

// Align text right/center/left for first/second/third cols respectively
@media (min-width: 556px) {
  .legal {
    text-align: right;
  }
  .about {
    text-align: center;
  }
  .social {
    text-align: left;
  }
}

.icon {
  width: 1.5em;
  font-size: 1.5em;
}

</style>
