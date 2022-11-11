import {createPinia, defineStore, PiniaCustomStateProperties} from 'pinia'

export const pinia = createPinia()

export const useStore = defineStore('main', {
	  state: (): PiniaCustomStateProperties => ({

	  })
});

declare module 'pinia' {
	export interface PiniaCustomStateProperties<S> {

	}
}
