import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort(
    'Boolean 2024',
    new Date('2024-08-08'),
    new Date('2024-11-01')
  )

  const cohort2 = await createCohort(
    'Experis 2024',
    new Date('2024-06-09'),
    new Date('2024-12-13')
  )

  const student = await createUser(
    'student@test.com',
    cohort.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'student1@github.com',
    'student1',
    '123-456-7890', // mobile
    'Software Engineering', // specialism
    new Date('2023-01-01'), // startDate
    new Date('2023-12-31'),
    null,
    'STUDENT',
    'Testpassword1!'
  )
  const jonas = await createUser(
    'jonas.halvorsen@test.com',
    cohort.id,
    'Jonas',
    'Halvorsen',
    'Hello, I am Jonas Halvorsen!',
    'jonas.halvorsen@github.com',
    'jonas.halvorsen',
    '123-456-7891', // mobile
    'Software Engineering', // specialism
    new Date('2023-01-01'), // startDate
    new Date('2023-12-31'),
    null,
    'STUDENT',
    'Testpassword1!'
  )
  const teacher = await createUser(
    'teacher@test.com',
    null,
    'Rick',
    'Sanchez',
    'Hello there!',
    'teacher1@git.com',
    'teacher1',
    '987-654-3210',
    'Teaching',
    new Date('2022-01-01'),
    new Date('2022-12-31'),
    null,
    'TEACHER',
    'Testpassword1!'
  )
  const nigel = await createUser(
    'nigel.sibbert@test.com',
    null,
    'Nigel',
    'Sibbert',
    'Hello, I am Nigel Sibbert!',
    'nigel.sibbert@github.com',
    'nigel.sibbert',
    '987-654-3211',
    'Teaching',
    new Date('2022-01-01'),
    new Date('2022-12-31'),
    null,
    'TEACHER',
    'Testpassword1!'
  )
  const dave = await createUser(
    'dave.ames@test.com',
    null,
    'Dave',
    'Ames',
    'Hello, I am Dave Ames!',
    'dave.ames@github.com',
    'dave.ames',
    '987-654-3212',
    'Teaching',
    new Date('2022-01-01'),
    new Date('2022-12-31'),
    null,
    'TEACHER',
    'Testpassword1!'
  )
  const thomas = await createUser(
    'thomas.wiik@test.com',
    cohort.id,
    'Thomas',
    'Wiik',
    'Hello, I am Thomas Wiik!',
    'thomas.wiik@github.com',
    'thomas.wiik',
    '123-456-7892', // mobile
    'Software Engineering', // specialism
    new Date('2023-01-01'), // startDate
    new Date('2023-12-31'),
    null,
    'STUDENT',
    'Testpassword1!'
  )
  const magnus = await createUser(
    'magnus.brandsegg@test.com',
    cohort.id,
    'Magnus',
    'Brandsegg',
    'Hello, I am Magnus Brandsegg!',
    'magnus.brandsegg@github.com',
    'magnus.brandsegg',
    '123-456-7893', // mobile
    'Software Engineering', // specialism
    new Date('2023-01-01'), // startDate
    new Date('2023-12-31'),
    null,
    'STUDENT',
    'Testpassword1!'
  )

const posts = [
    await createPost(
      student.id,
      'This is the first post. It contains some interesting information about our project. We are excited to share more updates soon.'
    ),
    await createPost(
      jonas.id,
      'Here is another post. This one talks about the progress we have made so far. Stay tuned for more details.'
    ),
    await createPost(
      thomas.id,
      'In this post, we discuss the challenges we faced and how we overcame them. It has been a learning experience.'
    ),
    await createPost(
      magnus.id,
      'This post is about the new features we are planning to add. We hope you find them useful and exciting.'
    ),
    await createPost(
      teacher.id,
      'As a teacher, I am proud of the progress my students have made. This post highlights their achievements.'
    )
  ]

  const comments = [
    'Great post!',
    'Very informative.',
    'Thanks for sharing.',
    'Looking forward to more updates.'
  ]

  for (const post of posts) {
    for (const comment of comments) {
      await createComment(student.id, post.id, comment)
      await createComment(jonas.id, post.id, comment)
      await createComment(thomas.id, post.id, comment)
      await createComment(magnus.id, post.id, comment)
    }
  }

  for (const post of posts) {
    await likePost(student.id, post.id)
    await likePost(jonas.id, post.id)
    await likePost(thomas.id, post.id)
    await likePost(magnus.id, post.id)
    await likePost(teacher.id, post.id)
  }
}

async function likePost(userId, postId) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      likedBy: {
        connect: { id: userId }
      }
    }
  })
  console.info(`User ${userId} liked Post ${postId}`)
}

async function createPost(userId, content) {
  const post = await prisma.post.create({
    data: {
      userId,
      content
    },
    include: {
      user: true
    }
  })

  console.info('Post created', post)

  return post
}

async function createComment(userId, postId, content) {
  const comment = await prisma.comment.create({
    data: {
      userId,
      postId,
      content
    },
    include: {
      user: true,
      post: true
    }
  })

  console.info('Comment created', comment)

  return comment
}

async function createCohort(cohortName, startDate, endDate) {
  const cohort = await prisma.cohort.create({
    data: {
      cohortName,
      startDate,
      endDate
    }
  })
  console.info('Cohort created', cohort)
  return cohort
}

async function createUser(
  email,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUrl,
  username,
  mobile,
  specialism,
  startDate,
  endDate,
  profileImage,
  role = 'STUDENT',
  password
) {
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 8),
      role,
      cohortId,
      profile: {
        create: {
          firstName,
          lastName,
          bio,
          githubUrl,
          profileImage,
          username,
          mobile,
          specialism,
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      }
    },
    include: {
      profile: true
    }
  })

  console.info(`${role} created`, user)

  return user
}

seed().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
