describe('Home Page Wrapper', () => {
  beforeEach(function () {
    cy.fixture('graphql-operations/VideoCardGetVideo.json').as('VideoCardMock')
    cy.fixture('graphql-operations/RecentProductionsListProductions.json').as('RPLMock')
  })

  describe('Home Page', () => {
    beforeEach(function () {
      cy.mockGraphql([this.VideoCardMock, this.RPLMock])
      cy.visit('/')
    })

    describe('RecentProductionsList Unit', function () {
      it('Contains proper metadata', function () {
        for (let i = 0; i < this.RPLMock.response.data.productions.length; i++) { // Foreach item...
          cy.get('.recent-prod a.recent-prod-link') // Get the card (anchor element) for this item in RPLMock
            .find('.v-image[title="' + this.RPLMock.response.data.productions[i].name + '"]')
            .parent()
            .as('cardAnchor')

          cy.get('@cardAnchor')
            .should('have.attr', 'href',
              '/productions/' + this.RPLMock.response.data.productions[i].id)

          cy.get('@cardAnchor').scrollIntoView()

          // Image links
          cy.get('@cardAnchor').find('.v-image__image[style*=\'url("' +
            this.RPLMock.response.data.productions[i].thumbnail.link + '")\']')
            .should('exist')
        }
      })
    })
  })
})
