/* eslint-disable object-shorthand */
import gql from 'graphql-tag'

export const state = () => ({
  /**
   * List of people to display. NOT a list of all people, but just the ones on the current page.
   */
  peopleList: [],
  /**
   * List of pages which should be considered cached.
   * Cache is manually controlled so it can be reset when the user adds/edits/removes a person or changes itemsPerPage.
   */
  cachedPages: [],
  /**
   * The page the user is currently on in the People List component.
   */
  currentPage: 1,
  /**
   * The number of people to display on each page in the People List component.
   */
  itemsPerPage: 20,
  /**
   * Total number of people.
   */
  totalItems: 0,
  /**
   * Whether the list is currently being populated, i.e. a request is pending
   */
  loading: true,
  /**
   * Whether there's a request for the total number of people pending.
   */
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
  /**
   * Change the current page to the specified page in payload. Fetches it from GQL and adds the page to cache list.
   * @param ctx Store context
   * @param payload {{page: int}} Action payload
   */
  gotoPage: function (ctx, payload) {
    ctx.commit('SET_PAGE', { page: payload.page })
    ctx.dispatch('populateList', { noCache: !ctx.state.cachedPages.includes(payload.page) })
    ctx.commit('ADD_CACHED', { page: payload.page })
  },
  /**
   * Request an updated list for the current page from the API. If the noCache payload prop is true, then the
   * 'no-cache' fetchPolicy is used. Otherwise Apollo will attempt to use it's cached response first.
   * @param ctx Store context
   * @param payload {{noCache: boolean}} Action payload
   * @return {Promise<void>}
   */
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
  /**
   * Get the total number of people from the API. Never uses cache.
   * @param ctx Store context
   * @return {Promise<void>}
   */
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
  /**
   * Change the number of items which should be displayed on each page. Clears all cached pages
   * @param ctx Store context
   * @param payload {{itemsPerPage: number}}
   */
  setItemsPerPageCount (ctx, payload) {
    ctx.commit('SET_ITEMS_PER_PAGE', { itemsPerPage: payload.itemsPerPage })
    ctx.commit('CLEAR_CACHED')
    ctx.dispatch('populateList', { noCache: true })
  }
}
