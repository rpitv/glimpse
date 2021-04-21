<template>
  <div class="">
    <VRow>
      <VCol cols="12" md="4" lg="3" offset-md="1" class="filters">
        <VRow>
          <VCol cols="12" sm="10" offset-sm="1">
            <h1 class="title">
              Productions
            </h1>
            <h2>Filters</h2>
            <VTextField @change="searchInput" v-model="searchVal" class="search" label="Search..." />
            <VSwitch
              @change="searchInput"
              v-model="isAdvancedSearch"
              label="Advanced Search"
              class="advanced-switch"
              color="primary"
            />
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="6" lg="7" offset-md="5" offset-lg="4">
        <div class="cards">
          <div v-for="prod in productions" class="rowitem">
            <ProductionCard
              :production-id="parseInt(prod.id)"
              :name="prod.name"
              :thumbnail="prod.thumbnail.link"
              :start="prod.startTime"
            />
          </div>
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        class="page-bottom"
      >
        <div
          v-intersect="onIntersect"
          class="end"
        />
        <div v-if="loadingMore">
          <VProgressCircular :size="70" :width="7" indeterminate color="primary" />
          <p class="loading-text">
            Loading...
          </p>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import ProductionCard from '@/components/ProductionCard'

export default {
  components: { ProductionCard },
  data () {
    return {
      title: 'Our Productions - RPI TV',
      description: 'List of all of RPI TV\'s past productions',
      searchVal: '',
      isAdvancedSearch: false,
      productions: [],
      loadingMore: false,
      prevPage: 0,
      // Note: the numbers 300 and 168.75 are important; they are the width & height of each individual card.
      countPerPage: Math.floor((this.$vuetify.breakpoint.width / 300) * (this.$vuetify.breakpoint.height / 168.75))
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:description', name: 'og:description', content: this.description },
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description }
      ]
    }
  },
  // async mounted () {
  //   this.loadingMore = true
  //   let prevLocation = parseInt(window.localStorage.getItem('productions-scroll-location')) || 0
  //   if (prevLocation % this.countPerPage !== 0) {
  //     prevLocation += prevLocation % this.countPerPage
  //   }
  //   const result = await this.getProductions(prevLocation, 0)
  //   this.prevPage = prevLocation / this.countPerPage
  //   this.productions = this.productions.concat(result.data.productions)
  //   this.loadingMore = false
  // },
  methods: {
    async getProductions (count, startIndex, searchVal, isAdvancedSearch) {
      const result = await this.$apollo.query({
        query: gql`query ProductionsGetProductions($prevProductionIndex: Int!, $pageSize: Int!,
            $searchVal: String, $isAdvancedSearch: Boolean) {
        productions: productions(pageSize: $pageSize, prevProductionIndex: $prevProductionIndex,
            searchCtx: $searchVal, advancedSearch: $isAdvancedSearch) {
          id
          name
          startTime
          thumbnail {
            link
          }
        }
      }`,
        variables: {
          prevProductionIndex: startIndex,
          pageSize: count,
          searchVal,
          isAdvancedSearch
        },
        errorPolicy: 'all'
      })

      if (!result) {
        return null
      } else if (result.errors != null && result.errors.length >= 1) {
        this.$store.commit('popups/SHOW_ERROR_MESSAGE', 'Search error: ' + result.errors[0].message)
        return null
      } else if (!result.data || !result.data.productions) {
        return null
      }
      return result.data.productions
    },
    async onIntersect () {
      if (this.loadingMore) {
        return
      }
      this.loadingMore = true
      window.localStorage.setItem('productions-scroll-location', ((this.prevPage + 1) * this.countPerPage).toString())
      const result = await this.getProductions(this.countPerPage, this.prevPage * this.countPerPage,
        this.searchVal, this.isAdvancedSearch)
      this.prevPage++
      if (result != null) {
        this.productions = this.productions.concat(result)
      }
      this.loadingMore = false
    },
    async searchInput () {
      this.prevPage = 0
      this.productions = []
      this.loadingMore = true
      const result = await this.getProductions(this.countPerPage, this.prevPage * this.countPerPage,
        this.searchVal, this.isAdvancedSearch)
      this.prevPage++
      if (result != null) {
        this.productions = this.productions.concat(result)
      }
      this.loadingMore = false
    }
  }
}
</script>

<style lang="scss" scoped>

@import '~vuetify/src/styles/styles';
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, max-content));
  justify-content: left;
  @media(max-width: map-get($grid-breakpoints, 'md')) {
    justify-content: center;
  }
}
.title {
  margin-bottom: 30px;
}
.rowitem {
  @media(max-width: map-get($grid-breakpoints, 'md')) {
    margin-left: 10px;
  }
  margin-bottom: 20px;
}
.end {
  position: absolute;
  bottom: 0;
  padding-top: 30px;
}
.filters {
  position: fixed;
  @media(max-width: map-get($grid-breakpoints, 'md')) {
    position: inherit;
  }
}
.page-bottom {
  text-align: center;
}
.loading-text {
  margin-top: 20px;
}
</style>
