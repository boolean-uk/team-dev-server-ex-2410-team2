import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

export default class User {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: int, cohortId: int, email: string, role: string, profile: { firstName: string, lastName: string, bio: string, githubUrl: string, username:string, mobile, profileImage: string } } } user
   * @returns {User}
   */
  static fromDb(user) {
    return new User(
      user.id,
      user.cohortId,
      user.profile?.firstName,
      user.profile?.lastName,
      user.email,
      user.profile?.bio,
      user.profile?.githubUrl,
      user.profile?.username,
      user.profile?.mobile,
      user.profile?.specialism,
      user.profile?.startDate,
      user.profile?.endDate,
      user.password,
      user.profile?.profileImage,
      user.role
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const {
      cohortId,
      firstName,
      lastName,
      email,
      bio,
      githubUrl,
      username,
      mobile,
      specialism,
      startDate,
      endDate,
      password,
      profileImage
    } = json

    let passwordHash = null
    if (password) {
      passwordHash = await bcrypt.hash(password, 8)
    }

    return new User(
      null,
      cohortId,
      firstName,
      lastName,
      email,
      bio,
      githubUrl,
      username,
      mobile,
      specialism,
      startDate,
      endDate,
      passwordHash,
      profileImage
    )
  }

  constructor(
    id,
    cohortId = 1,
    firstName,
    lastName,
    email,
    bio,
    githubUrl,
    username,
    mobile,
    specialism = 'Software Developer',
    startDate = new Date('2023-01-01'),
    endDate = new Date('2023-06-30'),
    passwordHash = null,
    profileImage = null,
    role = 'STUDENT'
  ) {
    this.id = id
    this.cohortId = cohortId
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.bio = bio
    this.githubUrl = githubUrl
    this.username = username
    this.mobile = mobile
    this.specialism = specialism
    this.startDate = startDate
    this.endDate = endDate
    this.passwordHash = passwordHash
    this.role = role
    this.profileImage = profileImage
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        cohort_id: this.cohortId,
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        bio: this.bio,
        githubUrl: this.githubUrl,
        profileImage: this.profileImage,
        username: this.username,
        mobile: this.mobile,
        specialism: this.specialism,
        startDate: this.startDate,
        endDate: this.endDate
      }
    }
  }

  /**
   * @returns {User}
   *  A user instance containing an ID, representing the user data created in the database
   */
  async save() {
    const data = {
      email: this.email,
      password: this.passwordHash,
      role: this.role,
      cohortId: this.cohortId
    }

    // This will break the code currently, needs a fix if you want to include cohort as its own table
    /* if (this.cohortId) {
      data.cohort = {
        connectOrCreate: {
          id: this.cohortId
        }
      }
    } */

    if (this.firstName && this.lastName) {
      data.profile = {
        create: {
          firstName: this.firstName,
          lastName: this.lastName,
          bio: this.bio,
          githubUrl: this.githubUrl,
          profileImage: this.profileImage,
          username: this.username,
          mobile: this.mobile,
          specialism: this.specialism,
          startDate: this.startDate,
          endDate: this.endDate
        }
      }
    } else {
      data.profile = {
        create: {
          firstName: '',
          lastName: '',
          bio: this.bio,
          githubUrl: this.githubUrl,
          profileImage: this.profileImage,
          username: this.username,
          mobile: this.mobile,
          specialism: this.specialism,
          startDate: this.startDate,
          endDate: this.endDate
        }
      }
    }
    const createdUser = await dbClient.user.create({
      data,
      include: {
        profile: true
      }
    })

    return User.fromDb(createdUser)
  }

  /**
   * @returns {User}
   *  A user instance containing the updated user data
   */
  async update() {
    const data = {
      email: this.email,
      role: this.role,
      cohortId: this.cohortId,
      profile: {
        update: {
          firstName: this.firstName,
          lastName: this.lastName,
          bio: this.bio,
          githubUrl: this.githubUrl,
          profileImage: this.profileImage,
          username: this.username,
          mobile: this.mobile,
          specialism: this.specialism,
          startDate: this.startDate,
          endDate: this.endDate
        }
      }
    }

    if (this.passwordHash) {
      data.password = this.passwordHash
    }

    const updatedUser = await dbClient.user.update({
      where: {
        id: this.id
      },
      data,
      include: {
        profile: true
      }
    })

    return User.fromDb(updatedUser)
  }

  static async findByEmail(email) {
    return User._findByUnique('email', email)
  }

  static async findById(id) {
    return User._findByUnique('id', id)
  }

  static async findManyByFirstName(firstName) {
    return User._findMany('firstName', firstName)
  }

  static async findAll() {
    return User._findMany()
  }

  static async _findByUnique(key, value) {
    const foundUser = await dbClient.user.findUnique({
      where: {
        [key]: value
      },
      include: {
        profile: true
      }
    })

    if (foundUser) {
      return User.fromDb(foundUser)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        profile: true
      }
    }

    if (key !== undefined && value !== undefined) {
      query.where = {
        profile: {
          [key]: value
        }
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }
}
