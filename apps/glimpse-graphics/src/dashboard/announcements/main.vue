<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<MessageControl />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">

import {NConfigProvider, darkTheme} from "naive-ui";
import MessageControl from "./MessageControl.vue";

</script>

<style scoped lang="scss">
</style>
