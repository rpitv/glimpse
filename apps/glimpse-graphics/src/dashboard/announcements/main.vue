<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<div>
				<AllAnnouncementsDisplay />
				<hr />
				<AllAnnouncementsControl />
				<hr />
				<AllAnnouncementsSettings />
			</div>
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">

import {NConfigProvider, darkTheme} from "naive-ui";
import AllAnnouncementsDisplay from "./AllAnnouncementsDisplay.vue";
import AllAnnouncementsControl from "./AllAnnouncementsControl.vue";
import AllAnnouncementsSettings from "./AllAnnouncementsSettings.vue";

</script>

<style scoped lang="scss">
</style>
