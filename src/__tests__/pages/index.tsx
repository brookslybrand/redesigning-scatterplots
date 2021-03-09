import { render, screen, fireEvent } from '@testing-library/react'
import Home from 'pages/index'

test('Renders app', () => {
  render(<Home />)
})

test('Sidebar opens and closes', async () => {
  render(<Home />)
  // make sure the sidebar information is hidden
  expect(screen.queryByText(/sidebar content/i)).toBeNull()
  // open the side bar and check that the info showed up
  fireEvent.click(screen.getByLabelText(/open sidebar/i))
  expect(screen.queryAllByText(/sidebar content/i).length).toBeGreaterThan(0)
})
