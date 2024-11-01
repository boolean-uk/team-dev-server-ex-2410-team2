import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort(
    'Boolean 2024',
    new Date('2024-08-08'),
    new Date('2024-11-01')
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

  const post1 = await createPost(student.id, 'My first post!')
  const post2 = await createPost(teacher.id, 'Hello, students')
  await createComment(student.id, post1.id, 'Nice post!')
  await createComment(teacher.id, post1.id, 'Thank you!')
  await createComment(student.id, post2.id, 'Hello, teacher!')

  await likePost(student.id, 2)
  await likePost(teacher.id, 1)

  process.exit(0)
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
