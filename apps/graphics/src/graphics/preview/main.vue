<template>
	<Suspense>
		<Preview />
	</Suspense>
</template>

<script setup lang="ts">
import Preview from "./Preview.vue";
</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@500;700;900&display=swap');
</style>

<style lang="scss">
body {
	overflow: hidden;
	margin: 0;
}
</style>
