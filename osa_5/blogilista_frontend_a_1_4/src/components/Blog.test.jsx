import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React components',
    author: 'Sofiya',
    url: 'http://example.com',
    likes: 10,
    user: {
      id: '123',
      username: 'sofiya',
      name: 'Sofiya S'
    }
  }

  const currentUser = {
    username: 'someoneelse'
  }

  //5.13
  test('renders title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    expect(screen.getByText('Testing React components Sofiya')).toBeDefined()
    expect(screen.queryByText('http://example.com')).toBeNull()
    expect(screen.queryByText('likes 10')).toBeNull()
  })

  //5.14
  test('shows url and likes when view button is clicked', async () => {
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    expect(screen.getByText('http://example.com')).toBeDefined()
    expect(screen.getByText('likes 10')).toBeDefined()
    expect(screen.getByText('Sofiya S')).toBeDefined()
  })

  // 5.15

  test('clicking like button twice calls event handler twice', async () => {
    const updateBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        updateBlog={updateBlog}
        deleteBlog={vi.fn()}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog).toHaveBeenCalledTimes(2)
  })
})
