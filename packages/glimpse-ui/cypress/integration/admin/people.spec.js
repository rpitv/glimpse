describe('People List Page Wrapper', () => {
  beforeEach(function () {
    cy.fixture('graphql-operations/people/GetPeople-15-5PerPage-Page1.json').as('perPage5Page1')
    cy.fixture('graphql-operations/people/GetPeople-15-5PerPage-Page2.json').as('perPage5Page2')
    cy.fixture('graphql-operations/people/GetPeople-15-10PerPage-Page2.json').as('perPage10Page2')
    cy.fixture('graphql-operations/people/GetPeople-15-20PerPage-Page1.json').as('perPage20Page1')
    cy.fixture('graphql-operations/people/PeopleCount-15.json').as('peopleCount15')
    cy.fixture('graphql-operations/people/PeopleCount-1000.json').as('peopleCount1000')
  })

  describe('People list Page', () => {
    describe('AdminPaginatedTable Unit', function () {
      it('Initiates with loading attribute', function () {
        cy.visit('/admin/people')
        cy.login()
        cy.get('.people-table .loading-text').should('contain.text', 'Loading items...')
      })

      it('Contains the proper data initially', function () {
        cy.mockGraphql([this.perPage20Page1, this.peopleCount15])
        cy.visit('/admin/people')
        cy.login()

        // Test initial item count is correct
        cy.get('.count-select .v-select__slot input[type="hidden"]')
          .should('have.attr', 'value', '20')
        // Test initial page is correct
        cy.get('.actions-wrapper .paginators .v-pagination__item.primary').should('contain.text', '1')
        // Test total number of pages is correct (1, plus 2 for the two arrow buttons)
        cy.get('.paginators li').its('length').should('eq', 3)

        // Row one - "Michael Scott", 2004 - Tests name w/o preferred name, past years, and redirect
        cy.get('.people-table tbody tr:not(.loading-text)').eq(0).as('rowOne')
        cy.get('@rowOne').find('td').eq(0).should('contain.text', 'Michael Scott')
        cy.get('@rowOne').find('td').eq(1).should('contain.text', '2004')
        // TODO linked users
        cy.get('@rowOne').find('td .edit-icon').click()
        cy.location('pathname').should('eq', '/admin/person/1')
        cy.visit('/admin/people')
        cy.login()

        // Row two - "Pamela "Pam" Halpert", 2008 - Tests preferred name
        cy.get('.people-table tbody tr:not(.loading-text)').eq(1).as('rowTwo')
        cy.get('@rowTwo').find('td').eq(0).should('contain.text', 'Pamela "Pam" Halpert')
        cy.get('@rowTwo').find('td').eq(1).should('contain.text', '2008')

        // Row four - "Dwight Schrute", 2010 - Tests out-of-order IDs
        cy.get('.people-table tbody tr:not(.loading-text)').eq(3).as('rowFour')
        cy.get('@rowFour').find('td').eq(0).should('contain.text', 'Dwight Schrute')
        cy.get('@rowFour').find('td').eq(1).should('contain.text', '2010')
        cy.get('@rowFour').find('td .edit-icon').click()
        cy.location('pathname').should('eq', '/admin/person/6')
        cy.visit('/admin/people')
        cy.login()

        // Row seven - "Last Name Only", 2092 - Tests last-name-only names and future years
        cy.get('.people-table tbody tr:not(.loading-text)').eq(6).as('rowSeven')
        cy.get('@rowSeven').find('td').eq(0).should('contain.text', 'Last Name Only')
        cy.get('@rowSeven').find('td').eq(1).should('contain.text', '2092')

        // Row eight - ""Preferred Name Only"", Tests preferred-name-only names
        cy.get('.people-table tbody tr:not(.loading-text)').eq(7)
          .find('td').eq(0).should('contain.text', '"Preferred Name Only"')

        // Row nine - "First "Preferred"", Tests no-last-name names
        cy.get('.people-table tbody tr:not(.loading-text)').eq(8)
          .find('td').eq(0).should('contain.text', 'First "Preferred"')

        // Row ten - ""Preferred" Last", Tests no-first-name names
        cy.get('.people-table tbody tr:not(.loading-text)').eq(9)
          .find('td').eq(0).should('contain.text', '"Preferred" Last')
        // Row eleven - "", Tests no-name names
        cy.get('.people-table tbody tr:not(.loading-text)').eq(10)
          .find('td').eq(0).should('contain.text', '')
      })

      it('Obeys query parameters on initial load', function () {
        cy.mockGraphql([this.perPage20Page1, this.peopleCount1000])
        // Page & No Count
        cy.visit('/admin/people?page=3').login()
        cy.get('.count-select .v-select__selection').should('contain.text', '20')
        cy.get('.paginators button.v-pagination__item.primary').should('contain.text', '3')
        // Page & Supported Count
        cy.visit('/admin/people?page=3&count=5').login()
        cy.get('.count-select .v-select__selection').should('contain.text', '5')
        cy.get('.paginators button.v-pagination__item.primary').should('contain.text', '3')
        // Page & Unsupported Count
        cy.visit('/admin/people?page=3&count=7').login()
        cy.get('.count-select .v-select__selection').should('not.exist')
        cy.get('.paginators button.v-pagination__item.primary').should('contain.text', '3')
        // No Page & Supported Count
        cy.visit('/admin/people?count=5').login()
        cy.get('.count-select .v-select__selection').should('contain.text', '5')
        cy.get('.paginators button.v-pagination__item.primary').should('contain.text', '1')
        // No Page & Unsupported Count
        cy.visit('/admin/people?count=7').login()
        cy.get('.count-select .v-select__selection').should('not.exist')
        cy.get('.paginators button.v-pagination__item.primary').should('contain.text', '1')
      })

      it('Displays error on no permission', function () {
        cy.visit('/admin/people')
        cy.get('.admin-paginated-table-permission-error').should('exist')
          .should('contain.text', 'You do not have permission to view this resource!')
      })
    })

    describe('PeopleList Unit', function () {
      it('Fetches next pages on page switch', function () {
        cy.mockGraphql((args) => {
          const req = args[1]
          const body = JSON.parse(req.body)
          if (body.operationName === 'GetPeople') {
            if (body.variables.cursor === -1) {
              return JSON.stringify(this.perPage5Page1.response)
            } else {
              return JSON.stringify(this.perPage5Page2.response)
            }
          } else if (body.operationName === 'PeopleCount') {
            return JSON.stringify(this.peopleCount15.response)
          }
        })
        cy.visit('/admin/people?count=5')
        cy.login()

        // Test initial item count is correct
        cy.get('.count-select .v-select__slot input[type="hidden"]')
          .should('have.attr', 'value', '5')
        // Test total number of pages is correct (3, plus 2 for the two arrow buttons)
        cy.get('.paginators li').its('length').should('eq', 5)

        // Test first and last
        cy.get('.people-table tbody tr:not(.loading-text)').eq(0)
          .find('td').eq(0).should('contain.text', 'Michael Scott')
        cy.get('.people-table tbody tr:not(.loading-text)').eq(4)
          .find('td').eq(0).should('contain.text', 'Creed Bratton')

        // Go to next page
        cy.get('.paginators li').last().find('button').click()

        // Test initial page is correct
        cy.get('.actions-wrapper .paginators .v-pagination__item.primary').should('contain.text', '2')
        // Test first and last
        cy.get('.people-table tbody tr:not(.loading-text)').eq(0)
          .find('td').eq(0).should('contain.text', 'First Name Only')
        cy.get('.people-table tbody tr:not(.loading-text)').eq(4)
          .find('td').eq(0).should('contain.text', '"Preferred" Last')
      })

      it('Does not fetch cached pages', function () {
        let page1Requests = 0
        let page2Requests = 0
        let countRequests = 0
        cy.mockGraphql((args) => {
          const req = args[1]
          const body = JSON.parse(req.body)
          if (body.operationName === 'GetPeople') {
            if (body.variables.cursor === -1) {
              page1Requests++
              return JSON.stringify(this.perPage5Page1.response)
            } else {
              page2Requests++
              return JSON.stringify(this.perPage5Page2.response)
            }
          } else if (body.operationName === 'PeopleCount') {
            countRequests++
            return JSON.stringify(this.peopleCount15.response)
          }
        })
        cy.visit('/admin/people?count=5')
        cy.login().then(() => {
          expect(page1Requests, 'Page 1 requests #1').to.equal(1)
          expect(page2Requests, 'Page 2 requests #1').to.equal(0)
          expect(countRequests, 'Page count requests #1').to.equal(1)
        })

        // Go to next page
        cy.get('.paginators li').last().find('button').click().then(() => {
          expect(page1Requests, 'Page 1 requests #2').to.equal(1)
          expect(page2Requests, 'Page 2 requests #2').to.equal(1)
          expect(countRequests, 'Page count requests #2').to.equal(1)
        })
        // Go to prev page
        cy.get('.paginators li').first().find('button').click().then(() => {
          expect(page1Requests, 'Page 1 requests #3').to.equal(1)
          expect(page2Requests, 'Page 2 requests #3').to.equal(1)
          expect(countRequests, 'Page count requests #3').to.equal(1)
        })
      })

      it('Clears cache when itemsPerPage is changed', function () {
        let page1Requests = 0
        let page2Requests = 0
        let countRequests = 0
        cy.mockGraphql((args) => {
          const req = args[1]
          const body = JSON.parse(req.body)
          if (body.operationName === 'GetPeople') {
            if (body.variables.cursor === -1) {
              page1Requests++
            } else {
              page2Requests++
            }
            return JSON.stringify(this.perPage5Page1.response)
          } else if (body.operationName === 'PeopleCount') {
            countRequests++
            return JSON.stringify(this.peopleCount1000.response)
          }
        })
        cy.visit('/admin/people?count=5')
        cy.login().then(() => {
          expect(page1Requests, 'Page 1 requests #1').to.equal(1)
          expect(page2Requests, 'Page 2 requests #1').to.equal(0)
          expect(countRequests, 'Page count requests #1').to.equal(1)
        })

        // Go to next page
        cy.get('.paginators li').last().find('button').click().then(() => {
          expect(page1Requests, 'Page 1 requests #2').to.equal(1)
          expect(page2Requests, 'Page 2 requests #2').to.equal(1)
          expect(countRequests, 'Page count requests #2').to.equal(1)
        })

        // Change item count per page
        cy.get('.count-select div.v-input__slot').click()
        cy.get('.v-menu__content .v-list-item').eq(1).click().then(() => {
          expect(page1Requests, 'Page 1 requests #2').to.equal(1)
          expect(page2Requests, 'Page 2 requests #2').to.equal(2)
          expect(countRequests, 'Page count requests #2').to.equal(1)
        })

        // Go to prev page
        cy.get('.paginators li').first().find('button').click().then(() => {
          expect(page1Requests, 'Page 1 requests #3').to.equal(2)
          expect(page2Requests, 'Page 2 requests #3').to.equal(2)
          expect(countRequests, 'Page count requests #3').to.equal(1)
        })
      })

      it('Clears cache on record deletion', function () {
        let peopleRequests = 0
        cy.mockGraphql((args) => {
          const req = args[1]
          const body = JSON.parse(req.body)
          if (body.operationName === 'GetPeople') {
            peopleRequests++
            return JSON.stringify(this.perPage5Page1.response)
          } else if (body.operationName === 'PeopleCount') {
            return JSON.stringify(this.peopleCount1000.response)
          } else if (body.operationName === 'DeletePerson') {
            return JSON.stringify({
              data: {
                deletePerson: true
              }
            })
          }
        })
        cy.visit('/admin/people?count=5')
        cy.login().then(() => {
          expect(peopleRequests, 'Page requests #1').to.equal(1)
        })

        // Go to next page and then prev page
        cy.get('.paginators li').last().find('button').click()
        cy.get('.paginators li').first().find('button').click().then(() => {
          expect(peopleRequests, 'Page requests #2').to.equal(2) // +1 request for page 2
        })

        cy.get('.people-table tbody tr:not(.loading-text)').eq(0)
          .find('td').eq(3).find('svg').eq(1).click().then(() => {
            expect(peopleRequests, 'Page requests #2').to.equal(3)
          })

        // Go to next page and then prev page
        cy.get('.paginators li').last().find('button').click()
        cy.get('.paginators li').first().find('button').click().then(() => {
          expect(peopleRequests, 'Page requests #2').to.equal(4) // +1 request for page 2
        })
      })

      it('Refreshes page when Refresh button is pressed', function () {
        // Desktop button
        cy.visit('/admin/people').login()
        cy.window().then((win) => {
          win.cypTestProp = 'abcd1234'
        })
        cy.window().its('cypTestProp').should('eq', 'abcd1234')
        cy.get('.action-buttons button.refresh-button').click()
        cy.window().its('cypTestProp').should('not.exist')
        // Mobile icon
        cy.viewport(900, 900).visit('/admin/people').login()
        cy.window().then((win) => {
          win.cypTestProp = '5678wxyz'
        })
        cy.window().its('cypTestProp').should('eq', '5678wxyz')
        cy.get('.action-buttons .icon.refresh-button').click()
        cy.window().its('cypTestProp').should('not.exist')
      })

      it('Opens new Person dialog on New Person button press', function () {
        // Desktop button
        cy.visit('/admin/people').login()
        cy.get('.action-buttons button.new-person-button').click()
        cy.get('.v-card__title').should('exist')
          .find('h2').should('contain.text', 'Create Person')
        // Mobile icon
        cy.viewport(900, 900).visit('/admin/people').login()
        cy.get('.action-buttons .icon.new-person-button').click()
        cy.get('.v-card__title').should('exist')
          .find('h2').should('contain.text', 'Create Person')
      })
    })
    describe('CreatePersonDialog Unit', function () {
      /**
       * Helper function to input sample data
       */
      function inputSampleData () {
        cy.get('.create-person-dialog .first-name-input input').type('George')
        cy.get('.create-person-dialog .pref-name-input input').type('Frankie')
        cy.get('.create-person-dialog .last-name-input input').type('Anderson')
        cy.get('.create-person-dialog .class-year-input input').clear().type('2016')
      }

      /**
       * Helper function to assert all fields are what they should be on initial opening
       */
      function assertInitialState () {
        cy.get('.create-person-dialog .first-name-input input').invoke('val').should('equal', '')
        cy.get('.create-person-dialog .pref-name-input input').invoke('val').should('equal', '')
        cy.get('.create-person-dialog .last-name-input input').invoke('val').should('equal', '')
        cy.get('.create-person-dialog .class-year-input input').invoke('val')
          .should('equal', (new Date().getFullYear() + 4).toString())
      }

      it('Creates a new Person with the specified attributes', function () {
        const status = { complete: false }
        cy.mockGraphql((args) => {
          const req = args[1]
          const body = JSON.parse(req.body)
          if (body.variables.firstName !== 'George' || body.variables.preferredName !== 'Frankie' ||
            body.variables.lastName !== 'Anderson' || body.variables.classYear !== 2016) {
            throw new Error('Incorrect request variables received! ' + JSON.stringify(body.variables))
          }
          status.complete = true
        })
        cy.visit('/admin/people').login()
        cy.get('.action-buttons button.new-person-button').click()
        inputSampleData()
        cy.get('.create-person-dialog .create-button').click()
        cy.wrap(status).its('complete').should('equal', true)
      })

      it('Initiates with empty name and class year = this year + 4', function () {
        cy.visit('/admin/people').login()
        cy.get('.action-buttons button.new-person-button').click()
        assertInitialState()
      })

      it('Resets values to default on cancel', function () {
        cy.visit('/admin/people').login()
        cy.get('.action-buttons button.new-person-button').click()
        inputSampleData()
        cy.get('.create-person-dialog .cancel-button').click()
        cy.get('.action-buttons button.new-person-button').click()
        assertInitialState()
      })

      it('Clears page cache on record insertion', function () {
        let pageRequests = 0
        cy.mockGraphql((args) => {
          const req = args[1]
          const body = JSON.parse(req.body)
          if (body.operationName === 'GetPeople') {
            pageRequests++
            return JSON.stringify(this.perPage5Page1.response)
          } else if (body.operationName === 'PeopleCount') {
            return JSON.stringify(this.peopleCount1000.response)
          } else if (body.operationName === 'CreatePerson') {
            return JSON.stringify({
              data: {
                createPerson: {
                  id: 12
                }
              }
            })
          }
        })

        cy.visit('/admin/people').login().then(() => {
          expect(pageRequests).to.equal(1)
        })
        cy.get('.action-buttons button.new-person-button').click()
        inputSampleData()
        cy.get('.create-person-dialog .create-button').click().then(() => {
          expect(pageRequests).to.equal(2)
        })
      })
    })
  })
})
