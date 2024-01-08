<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<Playlist />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import Playlist from "./Playlist.vue";

</script>

<style scoped>

</style>
