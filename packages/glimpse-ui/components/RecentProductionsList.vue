<template>
  <div class="past-prod-list">
    <VCard
      :href="'/productions/' + prod.id"
      v-for="prod in productions"
      :index="prod.id"
      :key="prod.id"
      class="past-prod-card"
      boilerplate
    >
      <VImg :src="prod.thumbnail.link" :title="prod.thumbnail.name" height="200px" />
      <VCardTitle>{{ prod.name }}</VCardTitle>
      <VCardSubtitle>{{ prod.description }}</VCardSubtitle>
      <VRow>
        <VCol>
          <VCardText class="v-card__subtitle">
            {{ getFormattedDate(prod) }}
          </VCardText>
        </VCol>
        <VCol>
          <VCardActions class="prod-actions">
            <VBtn :href="'/productions/' + prod.id" text color="primary">
              Watch
            </VBtn>
          </VCardActions>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'

export default {
  name: 'RecentProductionsList',
  data () {
    return {
      productions: []
    }
  },
  methods: {
    getFormattedDate (production) {
      return moment(production.startTime).format('MMM Do YYYY')
    }
  },
  apollo: {
    productions: gql`query { productions {
        id
        description
        name
        thumbnail {
            name
            link
        }
        startTime
}}`
  }
}
</script>

<style lang="scss" scoped>
  /* Fix word wrapping in cards - See vuetifyjs/vuetify/issues/9130 */
  .v-card__text, .v-card__title {
    word-break: normal;
  }

  .past-prod-list {
    white-space: nowrap;
    overflow-x: scroll;
    .past-prod-card {
      display: inline-block;
      width: 300px;
      margin-right: 20px;
    }

    .prod-actions {
      float: right;
    }
  }
</style>
