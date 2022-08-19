import {computed, ref, Ref} from "vue";

export async function replicant<T = any>(name: string, namespace?: string, defaultValue?: T): Promise<Ref<T>> {
	// @ts-ignore
	const realReplicant = nodecg.Replicant<T>(name, namespace, {defaultValue});

	let value: Ref<T|undefined> = ref(undefined);
	realReplicant.on('change', () => {
		value.value = <T>realReplicant.value; // Will not be undefined
	});

	await new Promise<void>((resolve) => realReplicant.on('change', () => resolve())); // Wait for replicant to be received from server

	return computed<T>({
		get() {
			return <T>value.value; // Will not be undefined. Value will have been received from server by this point.
		}, set(value) {
			realReplicant.value = value;
		}
	})
}
