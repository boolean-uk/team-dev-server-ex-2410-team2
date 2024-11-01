const Comment = require('./path/to/comment') // Adjust the path as necessary

async function testComment() {
  // Create a new comment instance
  const comment = new Comment({
    id: 1,
    content: 'Initial content',
    userId: 1,
    postId: 1
  })

  // Update the comment content
  await comment.update('Updated content')
}

testComment().catch(console.error)
