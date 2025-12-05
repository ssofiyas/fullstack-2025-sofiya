const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => {
    return blog.likes > fav.likes ? blog : fav
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const author = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  )

  return {
    author: author,
    blogs: counts[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likeCounts = {}
  blogs.forEach(blog => {
    likeCounts[blog.author] = (likeCounts[blog.author] || 0) + blog.likes
  })

  const author = Object.keys(likeCounts).reduce((a, b) =>
    likeCounts[a] > likeCounts[b] ? a : b
  )

  return {
    author: author,
    likes: likeCounts[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
