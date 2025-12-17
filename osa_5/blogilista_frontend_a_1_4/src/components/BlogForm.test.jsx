import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// tehtava 5.16

test('<BlogForm /> calls createBlog with correct data', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  await user.type(inputs[0], 'React Testing')
  await user.type(inputs[1], 'Sofiya')
  await user.type(inputs[2], 'http://example.com')

  await user.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'Sofiya',
    url: 'http://example.com'
  })
})
