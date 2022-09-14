<template>
	<Suspense>
		<div>
			<ImageView />
			<ScoreboardView />
		</div>
		<template #fallback>
			{{ scoreboardLoadingText }}
		</template>
	</Suspense>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import ScoreboardView from "./ScoreboardView.vue";
import ImageView from "./ImageView.vue";

// We don't want to immediately display loading text, as 99.9% of the time it isn't even necessary.
//  We only display it if the browser hasn't heard from the server in 5 seconds.
const scoreboardLoadingText = ref<string>("");
onMounted(() => {
	setTimeout(() => {
		scoreboardLoadingText.value = "Loading...";
	}, 5000);
});

</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Biryani:wght@400;600;700;900&display=swap');
</style>

