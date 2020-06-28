// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

async function handlePassedFn (args, fn) {
  let result = fn(args)
  // If result is a promise
  if (result && result.then && typeof result.then === 'function') {
    result = await result
  }

  if (!result) {
    return
  }

  // If result is just a string, form a proper response around it
  if (typeof result === 'string') {
    return Promise.resolve({
      ok: true,
      text () {
        return Promise.resolve(result)
      }
    })
  }
  // Trust user created a valid response object
  // Check if it's a promise already again, in which case return it. Otherwise wrap it in a promise.
  if (result && result.then && typeof result.then === 'function') {
    return result
  }
  return Promise.resolve(result)
}

function handlePassedArr (args, arr) {
  const request = args[1]
  let promise = null
  arr.some((stub) => {
    if (JSON.parse(request.body).operationName === stub.operation) {
      console.log('STUBBING', stub.operation)
      promise = Promise.resolve({
        ok: true,
        text () {
          return Promise.resolve(JSON.stringify(stub.response))
        }
      })
    }
  })
  return promise
}

Cypress.Commands.add('getStore', () => {
  return cy.get('#__nuxt', { log: false }).its('0.__vue__.$store', { log: false })
})

Cypress.Commands.add('login', () => {
  Cypress.log({
    name: 'Login'
  })
  return cy.getStore().then((store) => {
    store.commit('auth/SET_AUTH', { rcs_id: 'robere2', admin: true })
  })
})

Cypress.Commands.add('mockGraphql', (operationStubs) => {
  cy.on('window:before:load', (win) => {
    cy.stub(win, 'fetch', (...args) => {
      console.log('Handling fetch stub', args)
      const [url] = args
      let promise

      if (url.includes('/api/graphql')) {
        if (typeof operationStubs === 'function') {
          promise = handlePassedFn(args, operationStubs)
          Cypress.log({
            name: 'GraphQL Mock',
            message: 'Function',
            consoleProps () {
              return {
                Function: operationStubs
              }
            }
          })
        } else {
          promise = handlePassedArr(args, operationStubs)
          Cypress.log({
            name: 'GraphQL Mock',
            message: 'Array',
            consoleProps () {
              return {
                Array: operationStubs
              }
            }
          })
        }
      }

      if (promise) {
        return promise
      }

      console.log('Could not find a stub for the operation.')
      return false
    })
  })
})
