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
        <VTextField @change="searchInput" class="search" label="Search..." />
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
export default {
  name: 'AdminPaginatedTable',
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
    }
  },
  data () {
    return {
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
    searchInput (val) {
      this.$emit('searchInput', val)
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
      // Don't permalink if already contains the correct info
      if (this.$route.query[this.permalinkPage] === newPage && this.$route.query[this.permalinkCount] === newCount) {
        return
      }

      await this.$router.push({ query: Object.assign({}, this.$route.query, {
        [this.permalinkPage]: newPage,
        [this.permalinkCount]: newCount
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
