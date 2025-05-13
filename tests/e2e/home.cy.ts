import cy from 'cypress'

describe('Home Page', () => {
  it('should show the welcome message', () => {
    cy.visit('/')
    cy.contains('Welcome to React').should('be.visible')
  })
})
