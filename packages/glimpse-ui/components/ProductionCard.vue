<template>
  <NuxtLink :to="'/productions/' + productionId" class="card">
    <VCard :width="width">
      <VImg
        :src="thumbnail"
        :title="name"
        :aspect-ratio="16/9"
        gradient="to top, rgba(0,0,0,0.3), rgba(0,0,0,0)"
      >
        <div class="card-mask">
          <VCardTitle class="title">
            {{ name }}
          </VCardTitle>
          <VCardSubtitle class="subtitle">
            {{ formatDate(start) }}
          </VCardSubtitle>
        </div>
      </VImg>
    </VCard>
  </NuxtLink>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ProductionCard',
  props: {
    productionId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    start: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 300
    }
  },
  methods: {
    formatDate (str) {
      return moment(new Date(str)).format('MM-DD-YYYY')
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    &:hover {
      transform: scale(1.05);
    }
    transition: 0.3s;
    color: white;
    text-decoration: none;
    display: inline-block;
  }
  .title {
    position: absolute;
    bottom: 10px;
  }
  .subtitle {
    position: absolute;
    bottom: -10px;
    font-size: 18px;
  }
  .card-mask {
    margin: 0;
    background-image: linear-gradient(to bottom, #00000000, #000000ff);
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
  }
</style>
