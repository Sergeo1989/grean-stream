import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    specPattern: 'tests/e2e/**/*.cy.{ts,js}',
    supportFile: false,
  },
})
