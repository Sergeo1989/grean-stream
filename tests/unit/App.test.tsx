import { render, screen } from '@testing-library/react'
import App from '../../src/App'

describe('App component', () => {
  it('should render the welcome message', () => {
    render(<App />)
    expect(screen.getByText(/welcome to react/i)).toBeInTheDocument()
  })
})
