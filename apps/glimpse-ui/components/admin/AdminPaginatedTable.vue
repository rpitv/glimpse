<template>
  <div>
    <div v-if="!$store.state.auth.admin">
      <VAlert color="error" class="admin-paginated-table-permission-error">
        You do not have permission to view this resource!
      </VAlert>
    </div>
    <VCard v-else class="admin-paginated-table">
      <VCardTitle class="title">
        <h2 class="admin-paginated-table-header">
          {{ tableTitle }}
        </h2>
        <div class="actions-wrapper">
          <VSelect
            :items="countOptions"
            v-model="localItemsPerPage"
            @change="changeItemCount"
            class="count-select"
            hint="Item Count"
            persistent-hint
          />
          <div class="paginator-wrapper">
            <VPagination
              v-model="localPageNumber"
              :total-visible="visibleIcons"
              @input="changePage"
              :length="pageCount"
              class="paginators"
              light
            />
          </div>
        </div>
      </VCardTitle>
      <VCardText class="card-text">
        <VTextField @change="searchInput" v-model="localSearchCtx" class="search" label="Search..." />
        <VTooltip top>
          <template v-slot:activator="{ on }">
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              @click="showAdvancedInfo"
              v-on="on"
              class="advanced-search-info"
            />
          </template>
          <span>Click for more info</span>
        </VTooltip>
        <AdvancedSearchDialog v-model="showAdvancedSearchDialog" :fields="advancedSearchFields" />
        <VSwitch
          @change="searchInput"
          v-model="advancedSearch"
          label="Advanced Search"
          class="advanced-switch"
          color="primary"
        />
        <div class="action-buttons-wrapper">
          <div class="action-buttons">
            <slot name="actionButtons" />
          </div>
        </div>
      </VCardText>
      <VSimpleTable>
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header.key">
                {{ header.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <VProgressLinear v-show="loading" indeterminate class="loading-bar" />
            <tr v-if="loading && tableItems.length === 0" class="loading-text">
              <td :colspan="tableHeaders.length">
                Loading items...
              </td>
            </tr>
            <tr v-for="item in tableItems" :key="item.name">
              <td v-for="header in tableHeaders" :key="`${item.key}_${header.key}`">
                <slot :name="`item.${header.key}`" :item="item">
                  {{ item.values[header.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </template>
      </VSimpleTable>
    </VCard>
  </div>
</template>

<script>
import AdvancedSearchDialog from '../AdvancedSearchDialog'
export default {
  name: 'AdminPaginatedTable',
  components: { AdvancedSearchDialog },
  props: {
    itemCount: {
      type: Number,
      default: 0
    },
    doPermalink: {
      type: Boolean,
      default: true
    },
    permalinkPage: {
      type: String,
      default: 'page'
    },
    permalinkCount: {
      type: String,
      default: 'count'
    },
    permalinkSearch: {
      type: String,
      default: 'search'
    },
    permalinkAdvancedSearch: {
      type: String,
      default: 'adv'
    },
    initialSearchCtx: {
      type: String,
      default: ''
    },
    initialAdvSearch: {
      type: Boolean,
      default: false
    },
    initialPage: {
      type: Number,
      default: 1
    },
    initialItemsPerPage: {
      type: Number,
      default: 20
    },
    tableHeaders: {
      type: Array,
      required: true
    },
    tableItems: {
      type: Array,
      required: true
    },
    tableTitle: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    advancedSearchFields: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      showAdvancedSearchDialog: false,
      advancedSearch: this.initialAdvSearch,
      localSearchCtx: this.initialSearchCtx,
      localPageNumber: this.initialPage,
      localItemsPerPage: this.initialItemsPerPage,
      visibleIcons: 6,
      error: null,
      showError: false,
      countOptions: [5, 10, 20, 50, 100]
    }
  },
  computed: {
    pageCount () {
      return Math.ceil(this.itemCount / this.localItemsPerPage)
    },
    // Search context is different depending on the state of advanced search. Specifically, in simple search, all
    // search terms actually have an exclamation point on the end, marking them as "required".
    trueSearchCtx () {
      if (this.advancedSearch) {
        return this.localSearchCtx
      }

      let val = ''
      let inQuotes = false
      // Iterate over chars in string
      for (let i = 0; i < this.localSearchCtx.length; i++) {
        // Quotes signify string literals, i.e. spaces are allowed
        if (this.localSearchCtx[i] === '"') {
          inQuotes = !inQuotes
        } else if (this.localSearchCtx[i] === ' ') {
          // If not in quotes and the last character before a space is not !, append !.
          if (!inQuotes && val[val.length - 1] !== '!') {
            val += '!'
          }
        }
        val += this.localSearchCtx[i]
      }
      return val
    }
  },
  mounted () {
    window.addEventListener('resize', this.screenResize)
    this.screenResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenResize)
  },
  methods: {
    showAdvancedInfo () {
      this.showAdvancedSearchDialog = true
    },
    searchInput () {
      this.$emit('searchInput', this.trueSearchCtx, this.advancedSearch)
      this.changePage(1)
    },
    changePage (page) {
      if (page > this.pageCount) {
        page = this.pageCount
      }
      this.localPageNumber = page
      this.$emit('changePage', this.localPageNumber)
      this.permalink()
    },
    changeItemCount (count) {
      this.$emit('changeItemsPerPage', count)
      this.changePage(this.localPageNumber)
    },
    screenResize () {
      if (window.innerWidth > 1264) {
        this.visibleIcons = 10
      } else if (window.innerWidth > 600) {
        this.visibleIcons = 6
      } else {
        this.visibleIcons = 4
      }
    },
    async permalink () {
      const newPage = this.localPageNumber
      const newCount = this.localItemsPerPage
      const newSearch = this.localSearchCtx
      const newAdvancedSearch = this.advancedSearch ? '1' : ''
      // Don't permalink if already contains the correct info
      if (this.$route.query[this.permalinkPage] === newPage &&
        this.$route.query[this.permalinkCount] === newCount &&
        this.$route.query[this.permalinkSearch] === newSearch &&
      this.$route.query[this.permalinkAdvancedSearch] === newAdvancedSearch) {
        return
      }

      await this.$router.push({ query: Object.assign({}, this.$route.query, {
        [this.permalinkPage]: newPage,
        [this.permalinkCount]: newCount,
        [this.permalinkSearch]: newSearch === '' ? undefined : newSearch,
        [this.permalinkAdvancedSearch]: newAdvancedSearch === '' ? undefined : newAdvancedSearch
      })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .admin-paginated-table {
    margin-top: 30px;
  }
  .title {
    padding-bottom: 0;
    justify-content: space-between;
  }

  .advanced-search-info {
    margin-top: 5px;
    float: right;
    cursor: pointer;
  }
  .advanced-switch {
    display: inline-block;
    padding: 0;
    margin: 0;
    margin-right: 10px;
    float: right;
  }
  .actions-wrapper {

    @media (min-width: 1264px) {
      width: 40%;
    }
    .count-select {
      max-width: 75px;
      display: inline-block;
    }
    .paginator-wrapper {
      display: inline-block;
      @media (min-width: 1264px) {
        width: 80%;
      }
    }
  }
  .loading-text {
    text-align: center;
  }
  .loading-bar {
    margin: 0;
    padding: 0;
    position: absolute;
  }
  .action-buttons-wrapper {
    display: inline-block;
    width: 100%;
    margin: 0;
    padding: 0;
    .action-buttons {
      float: right;
    }
  }
  .card-text {
    padding-bottom: 0;
  }
</style>
