/* eslint-disable object-shorthand */
import gql from 'graphql-tag'

export const state = () => ({
  peopleList: [], // List of people to display
  cachedPages: [], // Cache is manually controlled so it can be reset when the user adds/edits/removes a person
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  loading: true,
  loadingCount: true
})

export const getters = {
  pageCount: state => Math.max(Math.ceil(state.totalItems / state.itemsPerPage), 1)
}

export const mutations = {
  SET_PEOPLE_COUNT: function (state, data) {
    state.totalItems = data.count
  },
  SET_PAGE: function (state, data) {
    state.currentPage = data.page
  },
  SET_ITEMS_PER_PAGE: function (state, data) {
    state.itemsPerPage = data.itemsPerPage
  },
  SET_PEOPLE_LIST: function (state, data) {
    state.peopleList = data.peopleList
  },
  SET_LOADING_STATE: function (state, data) {
    state.loading = data.loading
  },
  SET_LOADING_COUNT_STATE: function (state, data) {
    state.loadingCount = data.loadingCount
  },
  CLEAR_CACHED: function (state) {
    state.cachedPages = []
  },
  ADD_CACHED: function (state, data) {
    if (!state.cachedPages.includes(data.page)) {
      state.cachedPages.push(data.page)
    }
  }
}

export const actions = {
  gotoPage: function (ctx, payload) {
    ctx.commit('SET_PAGE', { page: payload.page })
    ctx.dispatch('populateList', { noCache: !ctx.state.cachedPages.includes(payload.page) })
    ctx.commit('ADD_CACHED', { page: payload.page })
  },
  async populateList (ctx, payload) {
    try {
      ctx.commit('SET_LOADING_STATE', { loading: true })
      const options = {
        query: gql`
          query GetPeople($cursor: Int!, $count: Int!) {
            people(prevPersonIndex: $cursor, pageSize: $count) {
              id
              firstName
              preferredName
              lastName
              classYear
            }
          }`,
        variables: {
          cursor: ((ctx.state.currentPage - 1) * ctx.state.itemsPerPage) - 1,
          count: ctx.state.itemsPerPage
        }
      }
      if (payload && payload.noCache) {
        options.fetchPolicy = 'no-cache'
      }
      const query = this.app.apolloProvider.defaultClient.query(options)
      const res = await query
      ctx.commit('SET_PEOPLE_LIST', { peopleList: res.data.people })
      ctx.commit('SET_LOADING_STATE', { loading: false })
    } catch (e) {
      this.$sentry.captureException(e)
      // TODO error reporting to user
    }
  },
  async getPeopleCount (ctx) {
    try {
      ctx.commit('SET_LOADING_COUNT_STATE', { loadingCount: true })

      const query = this.app.apolloProvider.defaultClient.query({
        fetchPolicy: 'no-cache',
        query: gql`query PeopleCount {
          peopleCount
        }`
      })
      const res = await query
      ctx.commit('SET_PEOPLE_COUNT', { count: res.data.peopleCount })
      ctx.commit('SET_LOADING_COUNT_STATE', { loadingCount: false })
    } catch (e) {
      this.$sentry.captureException(e)
      // TODO error reporting to user
    }
  },
  setItemsPerPageCount (ctx, payload) {
    ctx.commit('SET_ITEMS_PER_PAGE', { itemsPerPage: payload.itemsPerPage })
    ctx.dispatch('populateList', { noCache: true })
  }
}
