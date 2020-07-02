<template>
  <div class="container">
    <VBreadcrumbs :items="breadcrumbs" />
    <h1>
      Admin Panel
    </h1>
    <h2>Actions</h2>
    <div class="actions">
      <VBtn to="/admin/people" color="primary">
        Edit People
      </VBtn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Admin Panel',
      description: 'Edit productions, users, people, etc. for the RPI TV website.',
      breadcrumbs: [
        { text: 'Admin Panel', href: '/admin', disabled: true }
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
  }
}
</script>

<style lang="scss" scoped>
  .actions {
    margin-top: 20px;
  }
</style>
