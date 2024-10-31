import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import Cohort from '../domain/cohort.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await Cohort.save()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const getAll = async (req, res) => {
  const cohorts = await Cohort.getAllCohorts()
  if (!cohorts) {
    return sendMessageResponse(res, 500, 'Internal server error')
  }

  return sendDataResponse(res, 200, cohorts)
}

export const getById = async (req, res) => {
  const { id } = req.params
  const cohort = await Cohort.getCohortById(Number(id))

  if (!cohort) {
    return sendMessageResponse(res, 404, `Cohort with id ${id} not found`)
  }

  return sendDataResponse(res, 200, cohort)
}
