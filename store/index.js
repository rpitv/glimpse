export const actions = {
  nuxtServerInit: async (vuexCtx, requestCtx) => {
    await vuexCtx.dispatch('auth/resyncAuth', { cookies: requestCtx.req.headers.cookie })
  }
}
