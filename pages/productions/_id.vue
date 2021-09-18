<template>
  <div class="container prod-id-body">
    <h1>{{ production.name }}</h1>
    <p id="description">
      {{ production.description }}
    </p>
    <p id="starttime">
      {{ getProductionDate() }}
    </p>
    <VCarousel v-if="hasContent()">
      <VCarouselItem :v-for="video in production.videos">
        <div v-if="video.videoType === 'RTMP'">
          <p>Sorry, our video player is currently unavailable!</p>
          <p>
            Please <NuxtLink to="contact">
              reach out to us
            </NuxtLink> if you would like a copy of this video.
          </p>
        </div>
        <div v-else>
          <iframe
            :src="video.url"
            width="960"
            height="540"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </VCarouselItem>
      <VCarouselItem :v-for="image in production.images">
        <img :src="image.link" :alt="image.name">
      </VCarouselItem>
    </VCarousel>
    <div v-else class="no-content">
      <p>No images or video of this production are currently available.</p>
    </div>
    <h2 class="credits-header">
      Credits
    </h2>
    <VSimpleTable class="credits-table">
      <template v-slot:default>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Position
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="credit in production.credits">
            <td>
              <NuxtLink :to="'/members/' + credit.person.id">
                {{ (credit.person.preferredName ? credit.person.preferredName : credit.person.firstName) + " " + credit.person.lastName }}
              </NuxtLink>
            </td>
            <td>{{ credit.job }}</td>
          </tr>
        </tbody>
      </template>
    </VSimpleTable>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'

export default {
  data () {
    return {
      id: 0,
      production: {
        name: 'Loading...',
        description: 'Loading...',
        startTime: 0,
        credits: [],
        images: [],
        videos: []
      }
    }
  },
  asyncData (ctx) {
    return { id: parseInt(ctx.params.id) }
  },
  head () {
    const data = {
      title: this.title,
      meta: []
    }

    if (this.production?.name) {
      data.meta.push(
        { hid: 'og:title', name: 'og:title', content: this.production.name }
      )
    }
    if (this.production?.description) {
      data.meta.push(
        { hid: 'og:description', name: 'og:description', content: this.production.description },
        { hid: 'description', name: 'description', content: this.production.description },
        { hid: 'twitter:description', name: 'twitter:description', content: this.production.description }
      )
    }
    return data
  },
  methods: {
    getProductionDate () {
      if (!this.production || !this.production.startTime) {
        return 'Loading...'
      }
      return moment(this.production.startTime).format('MM-DD-YYYY HH:mm A')
    },
    hasContent () {
      if (!this.production || (!this.production.videos && !this.production.images)) {
        return false
      }
      return this.production.videos.length + this.production.images.length > 0
    }
  },
  apollo: {
    production: {
      prefetch: true,
      variables () {
        return {
          id: this.id
        }
      },
      errorPolicy: 'all',
      query: gql`query ProductionsIdGetProduction($id: Int!) {
        production: getProduction(id: $id) {
          id
          name
          description
          category {
            id
            name
          }
          credits {
            id
            job
            appearsAfter {
                id
            }
            person {
                id
                firstName
                preferredName
                lastName
            }
          }
          startTime
          thumbnail {
            link
            name
          }
          images {
            id
            name
            link
          }
          videos {
            id
            name
            videoType
            ... on EmbedVideo {
                url
            }
            ... on RTMPVideo {
                url
            }
          }
          visible
        }
      }`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles';

.prod-id-body {
  margin-top: 20px;
}
#description {
  margin-bottom: 5px;
}
#starttime {
  color: #aaa;
  font-size: 14px;
}
.no-content {
  padding: 5px;
  background-color: #00000050;
  font-style: italic;
  text-align: center;
  display:flex;
  justify-content:center;
  align-items:center;
  p {
    font-size: 20px;
  }
}
.credits-header {
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
