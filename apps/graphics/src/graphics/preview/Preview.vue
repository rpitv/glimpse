<template>
	<BugView v-if="bug" preview />
	<CommentatorsView v-if="commentators" preview />
	<CopyrightView v-if="copyright" preview />
	<LocatorView v-if="locator" preview />
	<LowerThirdScoreboardView v-if="scoreboard" preview />
</template>

<script setup lang="ts">
import BugView from "../glimpse/BugView.vue";
import CommentatorsView from "../glimpse/CommentatorsView.vue";
import CopyrightView from "../glimpse/CopyrightView.vue";
import LocatorView from "../glimpse/LocatorView.vue";
import LowerThirdScoreboardView from "../glimpse/LowerThirdScoreboardView.vue";
import { ref } from "vue";

const bug = ref(false);
const commentators = ref(false);
const copyright = ref(false);
const locator = ref(false);
const scoreboard = ref(false);


const params = new URLSearchParams(window.location.search);

if (params.has("bug"))
	bug.value = true;
if (params.has("commentators"))
	commentators.value = true;
if (params.has("copyright"))
	copyright.value = true;
if (params.has("locator"))
	locator.value = true;
if (params.has("lowerThirdScoreboard"))
	scoreboard.value = true;


</script>

<style scoped lang="scss">

</style>
