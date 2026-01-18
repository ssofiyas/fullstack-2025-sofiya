const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog Title', 'Test Author', 'http://testurl.com')
      await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First blog', 'Author One', 'http://first.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('user who created a blog can delete it', async ({ page }) => {
        const blogElement = page.locator('.note').filter({ hasText: 'First blog Author One' })
        await blogElement.getByRole('button', { name: 'view' }).click()

        await expect(blogElement.getByText('http://first.com')).toBeVisible()

        page.on('dialog', dialog => dialog.accept())
        await blogElement.getByText('remove').click()

        await expect(page.getByText('First blog Author One')).not.toBeVisible()
      })

      test('only the creator can see the delete button', async ({ page, request }) => {
        const blogElement = page.locator('.note').filter({ hasText: 'First blog Author One' })
        await blogElement.getByRole('button', { name: 'view' }).click()

        await expect(blogElement.getByText('remove')).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()

        await request.post('/api/users', {
          data: {
            name: 'Another User',
            username: 'another',
            password: 'password'
          }
        })

        await loginWith(page, 'another', 'password')
        const blogElement2 = page.locator('.note').filter({ hasText: 'First blog Author One' })
        await blogElement2.getByRole('button', { name: 'view' }).click()

        await expect(blogElement2.getByText('remove')).not.toBeVisible()
      })
    })

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First blog', 'Author', 'http://first.com')
        await createBlog(page, 'Second blog', 'Author', 'http://second.com')
        await createBlog(page, 'Third blog', 'Author', 'http://third.com')
      })

      test('blogs are ordered by likes', async ({ page }) => {
        const secondBlogElement = page.locator('.note').filter({ hasText: 'Second blog Author' })
        await secondBlogElement.getByRole('button', { name: 'view' }).click()
        await secondBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(secondBlogElement.getByText('likes 1')).toBeVisible()
        await secondBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(secondBlogElement.getByText('likes 2')).toBeVisible()

        const thirdBlogElement = page.locator('.note').filter({ hasText: 'Third blog Author' })
        await thirdBlogElement.getByRole('button', { name: 'view' }).click()
        await thirdBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(thirdBlogElement.getByText('likes 1')).toBeVisible()

        await page.reload()

        const firstBlog = page.locator('.note').first()
        await expect(firstBlog).toContainText('Second blog')

        const secondBlog = page.locator('.note').nth(1)
        await expect(secondBlog).toContainText('Third blog')

        const thirdBlog = page.locator('.note').nth(2)
        await expect(thirdBlog).toContainText('First blog')
      })
    })
  })
})
