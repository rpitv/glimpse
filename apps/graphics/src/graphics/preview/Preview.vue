<template>
	<BugView v-if="bug" preview />
	<CommentatorsView v-if="commentators" preview />
	<CopyrightView v-if="copyright" preview />
	<CreditsView v-if="credits" preview />
	<LocatorView v-if="locator" preview />
	<LowerThirdScoreboardView v-if="scoreboard" preview />
	<PlayerBioView v-if="playerBio" preview />
</template>

<script setup lang="ts">
import BugView from "../glimpse/LowerThirdViews/BugView.vue";
import CommentatorsView from "../glimpse/LowerThirdViews/CommentatorsView.vue";
import CopyrightView from "../glimpse/LowerThirdViews/CopyrightView.vue";
import CreditsView from "../glimpse/FullscreenViews/CreditView.vue";
import LocatorView from "../glimpse/LowerThirdViews/LocatorView.vue";
import LowerThirdScoreboardView from "../glimpse/LowerThirdViews/LowerThirdScoreboardView.vue";
import PlayerBioView from "../glimpse/LowerThirdViews/PlayerBioView.vue";
import { ref } from "vue";

const bug = ref(false);
const commentators = ref(false);
const copyright = ref(false);
const credits = ref(false);
const locator = ref(false);
const scoreboard = ref(false);
const playerBio = ref(false);


const params = new URLSearchParams(window.location.search);

if (params.has("bug"))
	bug.value = true;
if (params.has("commentators"))
	commentators.value = true;
if (params.has("copyright"))
	copyright.value = true;
if (params.has("credits"))
	credits.value = true;
if (params.has("locator"))
	locator.value = true;
if (params.has("lowerThirdScoreboard"))
	scoreboard.value = true;
if (params.has("playerBio"))
	playerBio.value = true;


</script>

<style scoped lang="scss">

</style>
