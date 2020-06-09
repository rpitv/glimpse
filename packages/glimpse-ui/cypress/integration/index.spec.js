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

    describe('RecentProductionsList Unit', function () {
      it('Contains proper metadata', function () {
        for (let i = 0; i < this.RPLMock.response.data.productions.length; i++) { // Foreach item...
          cy.get('.past-prod-list a.past-prod-card') // Get the card (anchor element) for this item in RPLMock
            .contains(this.RPLMock.response.data.productions[i].name)
            .parent()
            .parent()
            .as('cardAnchor')

          cy.get('@cardAnchor').scrollIntoView()

          // Image links
          cy.get('@cardAnchor').find('.v-image__image[style*=\'background-image: url("' +
            this.RPLMock.response.data.productions[i].thumbnail.link + '")\']')
            .should('exist')

          // Description
          cy.get('@cardAnchor')
            .find('.prod-card-text-wrapper')
            .should('contain', this.RPLMock.response.data.productions[i].description)

          // Timestamp
          cy.get('@cardAnchor').find('.row .v-card__subtitle').should('contain',
            moment(this.RPLMock.response.data.productions[i].startTime).format('MMM Do YYYY'))

          // Image title
          cy.get('@cardAnchor').find('.v-image')
            .should('have.attr', 'title', this.RPLMock.response.data.productions[i].thumbnail.name)
        }
      })

      it('Shows button when scrollX == 0', function () {
        cy.get('.past-prod-list .simplebar-content-wrapper').invoke('scrollLeft')
          .should('eq', 0)
        cy.get('.past-prod-list .scroll-btn').should('be.visible')
      })

      it('Smoothly scrolls when clicking the right chevron button', function () {
        cy.get('.past-prod-list .scroll-btn').click()
        cy.get('.past-prod-list .simplebar-content-wrapper').invoke('scrollLeft')
          .should('be.greaterThan', 0)
      })

      it('Hides button when scrollX > 0', function () {
        cy.get('.past-prod-list .simplebar-content-wrapper').scrollTo('right')
        cy.get('.past-prod-list .scroll-btn').should('not.be.visible')
      })
    })
  })
})
