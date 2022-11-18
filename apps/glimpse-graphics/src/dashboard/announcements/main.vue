<template>
	<n-config-provider :theme="darkTheme">
		<n-message-provider>
			<Suspense>
				<div>
					<AllAnnouncementsSections/>
				</div>
				<template #fallback>
					Loading...
				</template>
			</Suspense>
		</n-message-provider>
	</n-config-provider>
</template>

<script setup lang="ts">

import {NConfigProvider, darkTheme, NMessageProvider} from "naive-ui";
import AllAnnouncementsSections from "./AllAnnouncementsSections.vue";

</script>

<style scoped lang="scss">
</style>
