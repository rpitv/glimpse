<template>
  <div>
    <AdminPaginatedTable
      :item-count="$store.state.admin.people.totalItems"
      :initial-search-ctx="$store.state.admin.people.searchString"
      :initial-page="$store.state.admin.people.currentPage"
      :initial-items-per-page="$store.state.admin.people.itemsPerPage"
      :initial-adv-search="$store.state.admin.people.advancedSearch"
      :table-headers="tableHeaders"
      :table-items="tableItems"
      :loading="$store.state.admin.people.loading || $store.state.admin.people.loadingCount"
      :advanced-search-fields="['id', 'class_year', 'first_name', 'preferred_name', 'last_name']"
      @changePage="changePage"
      @changeItemsPerPage="changeItemCount"
      @searchInput="searchInput"
      table-title="People"
      class="people-table"
    >
      <template v-slot:actionButtons>
        <VBtn @click="refresh" color="secondary" class="refresh-button hidden-sm-and-down">
          Refresh
        </VBtn>
        <font-awesome-icon :icon="['fal', 'sync']" @click="refresh" class="refresh-button icon hidden-md-and-up" />
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
      </template>
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
    </AdminPaginatedTable>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import CreatePersonDialog from './CreatePersonDialog'
import AdminPaginatedTable from './AdminPaginatedTable'
export default {
  name: 'PeopleList',
  components: { AdminPaginatedTable, CreatePersonDialog },
  data () {
    return {
      localPageNumber: this.$store.state.admin.people.currentPage,
      localItemCount: this.$store.state.admin.people.itemsPerPage,
      visibleIcons: 6,
      countOptions: [5, 10, 20, 50, 100],
      tableHeaders: [
        {
          name: 'Name',
          key: 'name'
        },
        {
          name: 'Class Year',
          key: 'year'
        },
        {
          name: 'Linked User',
          key: 'user'
        },
        {
          name: 'Actions',
          key: 'actions'
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
          key: name.replace(' ', ''),
          id: person.id,
          values: {
            name,
            year: person.classYear,
            user: 'None'
          }
        })
      }
      return val
    }
  },
  mounted () {
    this.$store.dispatch('admin/people/getPeopleCount')
    this.$store.dispatch('admin/people/gotoPage', { page: this.localPageNumber })
  },
  methods: {
    changePage (page) {
      this.$store.dispatch('admin/people/gotoPage', { page })
    },
    changeItemCount (count) {
      this.$store.dispatch('admin/people/setItemsPerPageCount', { itemsPerPage: count })
    },
    searchInput (searchVal, isAdvanced) {
      searchVal = searchVal.trim()
      this.$store.dispatch('admin/people/search', { value: searchVal, isAdvanced })
      this.changePage(1)
    },
    editPerson (person) {
      this.$router.push('/admin/person/' + person.id)
    },
    deletePerson (person) {
      if (!confirm('Are you sure you want to delete ' + person.values.name + '?')) {
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
      })
    },
    refresh () {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
  .admin-paginated-table {
    margin-top: 30px;
  }
  .delete-icon {
    margin-left: 5px;
  }
  .delete-icon, .edit-icon {
    cursor: pointer;
  }
  .new-person-button, .refresh-button {
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
