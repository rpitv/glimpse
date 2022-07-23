<template>
  <footer>
    <n-grid cols="0:1 500:3" class="cols">
      <n-gi class="legal col">
        <h2>Legal</h2>
        <div class="legal">
          <p><RouterLink to="terms">Terms of Service</RouterLink></p>
          <p><RouterLink to="privacy">Privacy Policy</RouterLink></p>
          <p><RouterLink to="accessibility">Accessibility Statement</RouterLink></p>
        </div>
      </n-gi>
      <n-gi class="about col">
        <h2>About</h2>
        <p>Copyright &copy; RPI TV {{year}}</p>
        <p>
          <a href="https://github.com/rpitv/glimpse" class="github-link">
            An RCOS Project
            <FontAwesomeIcon class="github-icon icon" icon="fa-brands fa-github" />
          </a>
        </p>
        <p><RouterLink to="constitution">Constitution</RouterLink></p>
        <p><RouterLink to="wiki">Wiki</RouterLink></p>
      </n-gi>
      <n-gi class="col last-col social">
        <h2>Social</h2>
        <p><a href="https://www.youtube.com/rpitv">
          <FontAwesomeIcon class="youtube-icon icon" icon="fa-brands fa-youtube" />
          YouTube
        </a></p>
        <p><a href="https://twitter.com/rpitv">
          <FontAwesomeIcon class="twitter-icon icon" icon="fa-brands fa-twitter" />
          Twitter
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
      </n-gi>
    </n-grid>
  </footer>
</template>

<script setup lang="ts">
import { NGrid, NGi } from "naive-ui";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const year = new Date().getFullYear();

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
}
.last-col {
  border-right: none;
}
/* Not sure why this is 555px and not 500px. Look at the cols prop on n-grid */
@media(max-width: 555px) {
  .col {
    border-right: none;
  }
  .about {
    order: 1;
  }
  .legal {
    order: 2;
  }
  .social {
    order: 3
  }
}
// Align text right/center/left for first/second/third cols respectively
@media (min-width: 556px) {
  .legal {
    text-align: right;
  }
  .about {
    text-align: center;
  }
}

.icon {
  width: 1.5em;
  font-size: 1.5em;
}

</style>
