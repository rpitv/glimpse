<template>
  <div>
    <VRow class="justify-md-center">
      <VCol sm="8" md="6">
        <VSheet v-if="productions && productions.length > 0">
          <VHover v-slot:default="{ hover }">
            <VCard :nuxt="true" :to="'/productions/' + productions[0].id" class="the-card">
              <VImg :src="productions[0].thumbnail.link" max-height="370" />
              <div :class="'card-contents-wrapper' + (hover ? ' hovered' : '')">
                <div class="card-contents">
                  <VCardTitle>
                    {{ productions[0].name }}
                  </VCardTitle>
                  <VCardSubtitle>
                    {{ getFormattedDate(productions[0]) }}
                  </VCardSubtitle>
                  <VCardText>
                    {{ productions[0].description }}
                  </VCardText>
                </div>
              </div>
            </VCard>
          </VHover>
        </VSheet>
      </VCol>
      <VCol sm="4">
        <VSheet v-if="productions && productions.length > 1">
          <VHover v-slot:default="{ hover }">
            <VCard :nuxt="true" :to="'/productions/' + productions[1].id" class="the-card top-small-card">
              <VImg :src="productions[1].thumbnail.link" max-height="175" />
              <div :class="'card-contents-wrapper' + (hover ? ' hovered' : '')">
                <div class="card-contents">
                  <VCardTitle>
                    {{ productions[1].name }}
                  </VCardTitle>
                  <VCardSubtitle>
                    {{ getFormattedDate(productions[1]) }}
                  </VCardSubtitle>
                  <VCardText>
                    {{ productions[1].description }}
                  </VCardText>
                </div>
              </div>
            </VCard>
          </VHover>
        </VSheet>
        <VSheet v-if="productions && productions.length > 2">
          <VHover v-slot:default="{ hover }">
            <VCard :nuxt="true" :to="'/productions/' + productions[2].id" class="the-card">
              <VImg :src="productions[2].thumbnail.link" max-height="175" />
              <div :class="'card-contents-wrapper' + (hover ? ' hovered' : '')">
                <div class="card-contents">
                  <VCardTitle>
                    {{ productions[2].name }}
                  </VCardTitle>
                  <VCardSubtitle>
                    {{ getFormattedDate(productions[2]) }}
                  </VCardSubtitle>
                  <VCardText>
                    {{ productions[2].description }}
                  </VCardText>
                </div>
              </div>
            </VCard>
          </VHover>
        </VSheet>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'

export default {
  name: 'LandingHighlights',
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
    productions: {
      query: gql`query productions($perPage: Int!) {
            productions(pageSize: $perPage) {
              id
              description
              name
              thumbnail {
                  name
                  link
              }
              startTime
            }
    }`,
      variables: {
        perPage: 3
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .top-small-card {
    margin-bottom: 20px;
  }

  .the-card {
    position: relative;
  }
  .card-contents-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    background-color: #00000090;
    transition: opacity 0.35s ease-in-out;
    &.hovered {
      opacity: 1;
    }
    .card-contents {
      height: 100%;
      overflow: hidden;
      mask-image: linear-gradient(to bottom, white, white 75%, transparent);
    }
  }

  * {
    z-index: 1;
  }
</style>
