import {computed, ref, Ref} from "vue";
import {ReplicantOptions} from "nodecg-types/types/lib/replicant";

export async function replicant<T = any>(name: string, namespace?: string, options?: ReplicantOptions<T>): Promise<Ref<T>> {	// @ts-ignore
	const realReplicant = nodecg.Replicant<T>(name, namespace, options);

	let value: Ref<T|null|undefined> = ref(undefined);
	realReplicant.on('change', () => {
		// FIXME updating the value directly does not trigger the computed property to recompute for some reason.
		//  This is a workaround for now.
		if(typeof realReplicant.value === "object") {
			if(realReplicant.value === null) {
				value.value = null;
			} else if(Array.isArray(realReplicant.value)) {
				value.value = <T><unknown>[...realReplicant.value];
			} else {
				value.value = <T><unknown>{...realReplicant.value};
			}
		} else {
			value.value = <T>realReplicant.value;
		}
	});

	await new Promise<void>((resolve) => realReplicant.once('change', () => resolve())); // Wait for replicant to be received from server

	return computed<T>({
		get() {
			return <T>value.value; // Will not be undefined. Value will have been received from server by this point.
		}, set(value) {
			realReplicant.value = value;
		}
	})
}
