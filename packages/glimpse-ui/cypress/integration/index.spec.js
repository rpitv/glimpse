const moment = require('moment')

describe('Home Page Wrapper', () => {
  beforeEach(function () {
    cy.fixture('graphql-operations/LandingHighlightsProductions.json').as('LHPMock')
    cy.fixture('graphql-operations/VideoCardGetVideo.json').as('VideoCardMock')
    cy.fixture('graphql-operations/RecentProductionsListProductions.json').as('RPLMock')
  })

  describe('Home Page', () => {
    beforeEach(function () {
      cy.mockGraphql([this.LHPMock, this.VideoCardMock, this.RPLMock])
      cy.visit('/')
    })

    describe('LandingHighlights Unit', function () {
      it('Contains proper metadata', function () {
        for (let i = 0; i < this.LHPMock.response.data.productions.length; i++) { // Foreach item...
          cy.get('.v-sheet .the-card .v-image .v-image__image[style*=\'background-image: url("' +
            this.LHPMock.response.data.productions[i].thumbnail.link + '")\']') // ...check for the proper image links
            .should('be.visible')

          // ... check for the card contents with proper title, description, and formatted date
          cy.get('.hidden-sm-and-down').contains(this.LHPMock.response.data.productions[i].name).parent().as('cardElem')
          cy.get('@cardElem').should('contain', this.LHPMock.response.data.productions[i].description)
          cy.get('@cardElem').find('.v-card__subtitle').should('contain',
            moment(this.LHPMock.response.data.productions[i].startTime).format('MMM Do YYYY'))
        }
      })
    })
  })
})
