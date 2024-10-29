import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

/* CREATES A NEW USER */
export const create = async (req, res) => {
  try {
    const userToCreate = await User.fromJson(req.body)

    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}
/* GETS A USER BY ID */
export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

/* GETS ALL USERS */
export const getAll = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}
/* Updates a user by ID */

export const updateById = async (req, res) => {
  const id = parseInt(req.params.id)
  const userToUpdate = await User.fromJson(req.body)

  // Add id, cohortId and role (could be done in the domain)
  userToUpdate.id = id
  userToUpdate.cohortId = req.body.cohortId
  userToUpdate.role = req.body.role

  try {
    if (!userToUpdate.cohortId) {
      return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
    }
    const updatedUser = await userToUpdate.update()

    return sendDataResponse(res, 201, updatedUser)
  } catch (error) {
    console.log(error)
    return sendMessageResponse(res, 500, 'Unable to update user')
  }
}

/* Test Commit statement */
