<template>
	<v-table>
		<thead>
			<tr>
				<th class="text-left">
					Name
				</th>
				<th class="text-left">
					Preview
				</th>
				<th class="text-left">
					Controls
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(ad, i) in ads" :key="ad.sum" >
				<td>
					{{ ad.name }}
				</td>
				<td>
					<video ref="videos" controls height="150" @loadedmetadata="getDuration(i as number)">
						<source :src="ad.url">
					</video>
				</td>
				<td>
					<v-btn :color="ad.visible ? 'red' : 'green'" @click="ad.visible = !ad.visible" class="text-none">
						{{ ad.visible ? 'Remove' : 'Add' }}
					</v-btn>
				</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import {replicant} from "../../browser-common/replicant";
import {ref} from "vue";

const replicants = await loadReplicants()
const ads = await replicant('assets:advertisements');

const videos = ref<HTMLVideoElement[]>([]);

function getDuration(index: number) {
	console.dir(videos.value[index]);
}

</script>

<style scoped lang="scss">

</style>
