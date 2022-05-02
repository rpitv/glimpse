/* eslint-disable object-shorthand */

export const state = () => ({
  errorMessage: ''
})

export const getters = {
  isAuthenticated: state => !!state.rcs_id
}

export const mutations = {
  SHOW_ERROR_MESSAGE: function (state, err) {
    this.$sentry.addBreadcrumb({
      category: 'store',
      message: 'Mutation: SHOW_ERROR_MESSAGE: ' + err,
      level: this.$sentry.Severity.Info
    })
    state.errorMessage = err
  }
}

export const actions = {
}
