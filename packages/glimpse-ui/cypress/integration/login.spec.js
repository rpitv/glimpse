describe('Login Process', () => {

  it('Redirects to RPI CAS when unauthed w/ no ticket', function () {
    cy.visit('/login')
    cy.location('origin').should('eq', 'https://cas-auth.rpi.edu')
  })

  it('Authenticates when unauthed w/ valid ticket (Admin)', function () {
    cy.server()
    cy.route('POST', '/api/auth/login', {rcs_id: 'user1', admin: true})
    cy.visit('/login?ticket=valid-ticket-1')
    cy.location('pathname', {timeout: 10000}).should('eq', '/')
    cy.get('.app-nav-right-items').should(($el) => {
      expect($el.text()).to.contain('user1@rpi.edu')
    })
    cy.get('.app-nav-right-items .item-wrapper').eq(3).find('button').trigger('mouseenter')
    cy.get('.header-dropdown').should(($el) => {
      expect($el.text()).to.contain('Admin Panel')
    })
  })

  it('Authenticates when unauthed w/ valid ticket (Non-Admin)', function () {
    cy.server()
    cy.route('POST', '/api/auth/login', {rcs_id: 'user2', admin: true})
    cy.visit('/login?ticket=valid-ticket-2')
    cy.location('pathname', {timeout: 10000}).should('eq', '/')
    cy.get('.app-nav-right-items').should(($el) => {
      expect($el.text()).to.contain('user2@rpi.edu')
    })
    cy.get('.app-nav-right-items .item-wrapper').eq(3).find('button').trigger('mouseenter')
    cy.get('.header-dropdown').should(($el) => {
      expect($el.text()).to.not.contain('Admin Panel')
    })
  })

  it('Errors when unauthed w/ invalid ticket (Provided error)', function () {
    cy.server()
    cy.route({
      method: 'POST',
      response: {error: 'SAMPLE_ERROR'},
      url: '/api/auth/login',
      status: 400
    })
    cy.visit('/login?ticket=invalid-ticket-1')
    cy.get('.logging-in-card')
      .should('contain', 'Something went wrong! Here\'s an error code: SAMPLE_ERROR')
  })

  it('Errors when unauthed w/ invalid ticket (HTTP error)', function () {
    cy.server()
    cy.route({
      method: 'POST',
      response: '',
      url: '/api/auth/login',
      status: 502
    })
    cy.visit('/login?ticket=invalid-ticket-2')
    cy.get('.logging-in-card')
      .should('contain', 'Something went wrong! Here\'s an error code: BAD GATEWAY')
  })
})
