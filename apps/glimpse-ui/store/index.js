/* eslint-disable object-shorthand */
import axios from 'axios'

export const state = () => ({
  rcs_id: '',
  admin: false,
  showFailedAuth: false // Show a failed authentication message snackbar
})

export const getters = {
  isAuthenticated: state => !!state.rcs_id
}

export const mutations = {
  SET_AUTH: function (state, data) {
    this.$sentry.addBreadcrumb({
      category: 'store',
      message: 'Mutation: SET_AUTH',
      data: {
        rcs_id: data.rcs_id,
        admin: data.admin
      },
      level: this.$sentry.Severity.Info
    })
    state.rcs_id = data.rcs_id
    state.admin = data.admin
  },
  SHOW_FAILED_AUTH: function (state) {
    this.$sentry.addBreadcrumb({
      category: 'store',
      message: 'Mutation: SHOW_FAILED_AUTH',
      level: this.$sentry.Severity.Info
    })
    state.showFailedAuth = true
  }
}

export const actions = {
  resyncAuth: async function (ctx, payload) {
    this.$sentry.addBreadcrumb({
      category: 'store',
      message: 'Action: resyncAuth',
      level: this.$sentry.Severity.Info
    })
    try {
      // Attempt syncronization server-side by using the client's cookies. This isn't super secure/ideal and would
      // break if we were to add any IP-based verification. Should be changed but it works... Kind of slow though. TODO
      const config = process.browser ? {} : {
        headers: { Cookie: payload.cookies ? payload.cookies : '' }
      }
      const url = process.browser ? '/api/auth/sync' : (process.env.BASE_URL + '/api/auth/sync')

      const response = await axios.get(url, config)
      ctx.commit('SET_AUTH', { rcs_id: response.data.rcs_id, admin: response.data.admin })
    } catch (e) {
      console.error(e)
      ctx.commit('SHOW_FAILED_AUTH')
    }
  },
  nuxtServerInit: async (vuexCtx, requestCtx) => {
    await vuexCtx.dispatch('resyncAuth', { cookies: requestCtx.req.headers.cookie })
  }
}
