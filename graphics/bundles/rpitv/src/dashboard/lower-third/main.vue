<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<LowerThird />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import LowerThird from "./LowerThird.vue";

</script>

<style scoped>

</style>
