import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort()

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

  await createPost(student.id, 'My first post!')
  await createPost(teacher.id, 'Hello, students')

  process.exit(0)
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

async function createCohort() {
  const cohort = await prisma.cohort.create({
    data: {}
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
