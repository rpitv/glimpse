<template>
<n-table>
	<thead>
		<tr>
			<th>Image Name</th>
			<th>Preview</th>
			<th>Controls</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="img in images" :key="img.sum">
			<td>
				{{img.base}}
			</td>
			<td>
				<img :src="img.url" alt="Image Preview" />
			</td>
			<td>
				<n-button :type="img.visible ? 'error' : 'success'" @click="img.visible = !img.visible">
					{{img.visible ? 'Hide' : 'Show'}}
				</n-button>
			</td>
		</tr>
	</tbody>
</n-table>
</template>

<script setup lang="ts">
import {NTable, NButton} from "naive-ui";

import {replicant} from "../../browser-common/replicant";

const images = await replicant('assets:images');
</script>

<style scoped lang="scss">
	img {
		width: 250px;
		height: 140.6px;
	}
</style>
