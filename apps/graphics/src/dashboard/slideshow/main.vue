<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<Slideshow />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import Slideshow from "../slideshow/Slideshow.vue";

</script>

<style scoped>

</style>
