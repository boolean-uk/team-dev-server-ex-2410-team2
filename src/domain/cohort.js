import dbClient from '../utils/dbClient.js'
import User from './user.js'

export class Cohort {
  static fromDb(cohort) {
    return new Cohort(
      cohort.id,
      cohort.cohortName,
      cohort.startDate,
      cohort.endDate,
      cohort.students.map((student) => User.fromDb(student))
    )
  }

  static async fromJson(json) {
    const { cohortId, cohortName, startDate, endDate, students } = json
    return new Cohort(
      cohortId,
      cohortName,
      startDate,
      endDate,
      students.map((student) => User.fromJson(student))
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
      startDate: this.startDate
    }

    if (this.endDate) {
      data.endDate = this.endDate
    } else {
      data.endDate = null
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
}
