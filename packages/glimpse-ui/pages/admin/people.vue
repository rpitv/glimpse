<template>
  <div class="container">
    <VBreadcrumbs :items="breadcrumbs" />
    <PeopleList />
  </div>
</template>

<script>
import PeopleList from '../../components/admin/PeopleList'
export default {
  components: { PeopleList },
  data () {
    return {
      title: 'People List',
      description: 'Edit people on the RPI TV website.',
      breadcrumbs: [
        { text: 'Admin Panel', href: '/admin' },
        { text: 'People', href: '/admin/people', disabled: true }
      ]
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
  created () {
    if (this.$route.query.page && parseInt(this.$route.query.page) >= 1) {
      this.$store.dispatch('admin/people/gotoPage', { page: parseInt(this.$route.query.page) })
    }
    if (this.$route.query.count && parseInt(this.$route.query.count) >= 1) {
      this.$store.dispatch('admin/people/setItemsPerPageCount', {
        itemsPerPage: parseInt(this.$route.query.count)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
