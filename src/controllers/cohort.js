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
