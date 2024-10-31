import dbClient from '../utils/dbClient.js'
import User from './user.js'

export default class Cohort {
  static fromDb(cohort) {
    return new Cohort(
      cohort.id,
      cohort.cohortName,
      cohort.startDate,
      cohort.endDate,
      cohort.students
        ? cohort.students.map((student) => User.fromDb(student))
        : []
    )
  }

  static async fromJson(json) {
    const { cohortId, cohortName, startDate, endDate, students } = json
    return new Cohort(
      cohortId,
      cohortName,
      startDate,
      endDate,
      students ? students.map((student) => User.fromJson(student)) : []
    )
  }

  constructor(id, cohortName, startDate, endDate = null, students = []) {
    this.id = id
    this.cohortName = cohortName
    this.startDate = startDate
    this.endDate = endDate
    this.students = students
  }

  toJSON() {
    return {
      cohort: {
        id: this.id,
        cohortName: this.cohortName,
        startDate: this.startDate,
        endDate: this.endDate,
        students: this.students.map((student) => student.toJSON())
      }
    }
  }

  async save() {
    const data = {
      cohortName: this.cohortName,
      startDate: this.startDate,
      endDate: this.endDate !== undefined ? this.endDate : null
    }

    const createdCohort = await dbClient.cohort.create({ data })
    return Cohort.fromDb(createdCohort)
  }

  async update() {
    const updatedCohort = await dbClient.cohort.update({
      where: {
        id: this.id
      },
      data: {
        cohortName: this.cohortName,
        startDate: this.startDate,
        endDate: this.endDate
      }
    })

    return Cohort.fromDb(updatedCohort)
  }

  static async getAllCohorts() {
    const cohorts = await dbClient.cohort.findMany({
      include: {
        students: true
      }
    })
    return cohorts.map((cohort) => Cohort.fromDb(cohort))
  }

  static async getCohortById(id) {
    const cohort = await dbClient.cohort.findUnique({
      where: { id },
      include: {
        students: true
      }
    })
    return cohort ? Cohort.fromDb(cohort) : null
  }

  static async updateById(id, cohort) {
    const data = {}
    if (cohort.cohortName !== undefined) data.cohortName = cohort.cohortName
    if (cohort.startDate !== undefined) data.startDate = cohort.startDate
    if (cohort.endDate !== undefined) data.endDate = cohort.endDate

    return this.fromDb(
      await dbClient.cohort.update({
        where: { id },
        data
      })
    )
  }

  static async deleteById(id) {
    return this.fromDb(
      await dbClient.cohort.delete({
        where: { id }
      })
    )
  }
}
