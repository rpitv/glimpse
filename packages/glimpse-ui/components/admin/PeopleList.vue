<template>
  <div>
    <div v-if="!$store.state.auth.admin">
      <VAlert color="error">
        You do not have permission to view this resource!
      </VAlert>
    </div>
    <VCard v-else class="people-table">
      <VSnackbar v-model="showError" color="error" top>
        {{ error }}

        <template v-slot:action="{ attrs }">
          <VBtn
            v-bind="attrs"
            @click="showError = false"
            color="white"
            text
          >
            Close
          </VBtn>
        </template>
      </VSnackbar>
      <VCardTitle class="title">
        <h2 class="people-header">
          People
        </h2>
        <div class="actions-wrapper">
          <VSelect
            :items="countOptions"
            v-model="localItemCount"
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
              :length="$store.getters['admin/people/pageCount']"
              class="paginators"
              light
            />
          </div>
        </div>
      </VCardTitle>
      <VCardText>
        <VTextField class="search" label="Search..." />
        <a>Filter guide</a>
        <CreatePersonDialog>
          <template v-slot:activator="{ on, attrs }">
            <VBtn v-on="on" v-bind="attrs" color="primary" class="new-person-button hidden-sm-and-down">
              New Person
            </VBtn>
            <font-awesome-icon
              v-on="on"
              v-bind="attrs"
              :icon="['fal', 'plus']"
              class="new-person-button icon hidden-md-and-up"
            />
          </template>
        </CreatePersonDialog>
        <VBtn @click="refresh" color="secondary" class="refresh-button hidden-sm-and-down">
          Refresh
        </VBtn>
        <font-awesome-icon :icon="['fal', 'sync']" @click="refresh" class="refresh-button icon hidden-md-and-up" />
      </VCardText>
      <VDataTable
        :headers="tableHeaders"
        :items="tableItems"
        :items-per-page="1000"
        :loading="$store.state.admin.people.loading || $store.state.admin.people.loadingCount"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <VTooltip top>
            <template v-slot:activator="{ on }">
              <font-awesome-icon :icon="['fal', 'pencil']" @click="editPerson(item)" v-on="on" class="edit-icon" />
            </template>
            <span>Edit Person</span>
          </VTooltip>
          <VTooltip top>
            <template v-slot:activator="{ on }">
              <font-awesome-icon :icon="['fal', 'trash']" @click="deletePerson(item)" v-on="on" class="delete-icon" />
            </template>
            <span>Delete Person</span>
          </VTooltip>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import CreatePersonDialog from './CreatePersonDialog'
export default {
  name: 'PeopleList',
  components: { CreatePersonDialog },
  data () {
    return {
      localPageNumber: this.$store.state.admin.people.currentPage,
      localItemCount: this.$store.state.admin.people.itemsPerPage,
      visibleIcons: 6,
      error: null,
      showError: false,
      countOptions: [5, 10, 20, 50, 100],
      tableHeaders: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Class Year',
          value: 'year'
        },
        {
          text: 'Linked User',
          value: 'user',
          sortable: false
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ]
    }
  },
  computed: {
    tableItems () {
      const val = []
      for (let i = 0; i < this.$store.state.admin.people.peopleList.length; i++) {
        const person = this.$store.state.admin.people.peopleList[i]
        let name
        if (person.preferredName) {
          name = person.firstName + ' "' + person.preferredName + '" ' + person.lastName
        } else {
          name = person.firstName + ' ' + person.lastName
        }
        val.push({
          name,
          year: person.classYear,
          user: 'None',
          id: person.id
        })
      }
      return val
    }
  },
  mounted () {
    this.$store.dispatch('admin/people/getPeopleCount')
    this.$store.dispatch('admin/people/gotoPage', { page: this.localPageNumber })
    window.addEventListener('resize', this.screenResize)
    this.screenResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenResize)
  },
  methods: {
    changePage (page) {
      const pageCount = this.$store.getters['admin/people/pageCount']
      if (page > pageCount) {
        page = pageCount
      }
      this.localPageNumber = page
      this.$store.dispatch('admin/people/gotoPage', { page })
      this.permalink()
    },
    changeItemCount (count) {
      this.$store.dispatch('admin/people/setItemsPerPageCount', { itemsPerPage: count })
      const newPage = Math.min(this.$store.state.admin.people.currentPage, this.$store.getters['admin/people/pageCount'])
      this.localPageNumber = newPage
      this.changePage(newPage)
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
      const newPage = this.$store.state.admin.people.currentPage
      const newCount = this.$store.state.admin.people.itemsPerPage
      // Don't permalink if already contains the correct info
      if (this.$route.query.page === newPage && this.$route.query.count === newCount) {
        return
      }

      await this.$router.push({ query: Object.assign({}, this.$route.query, {
        page: newPage,
        count: newCount
      })
      })
    },
    editPerson (person) {
      this.$router.push('/admin/person/' + person.id)
    },
    deletePerson (person) {
      if (!confirm('Are you sure you want to delete ' + person.name + '?')) {
        return
      }

      this.$apollo.mutate({
        mutation: gql`mutation DeletePerson($id: Int!) {
            deletePerson(id: $id)
        }`,
        variables: {
          id: parseInt(person.id)
        }
      }).then(async () => {
        this.$store.commit('admin/people/CLEAR_CACHED')
        await this.$store.dispatch('admin/people/getPeopleCount')
        this.changePage(this.localPageNumber)
      }).catch((err) => {
        this.$sentry.captureException(err)
        this.error = err
        this.showError = true
      })
    },
    refresh () {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
  .people-table {
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
  .delete-icon {
    margin-left: 5px;
  }
  .delete-icon, .edit-icon {
    cursor: pointer;
  }
  .new-person-button, .refresh-button {
    float: right;
    &.icon {
      color: white;
      font-size: 1.6em;
    }
  }
  .refresh-button {
    margin-right: 10px;
    &.icon {
      margin-right: 20px;
    }
  }
</style>
