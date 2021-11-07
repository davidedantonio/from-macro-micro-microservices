'use strict'

const DUPLICATE_KEY_ERROR = 11000
const securePassword = require('secure-password')

async function deleteUser (request, reply) {
  const collection = this.mongo.db.collection('users')
  const { ObjectId } = this.mongo

  const { id } = request.params
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  })

  if (result.deletedCount === 0) {
    return this.httpErrors.notFound(`No user found with id ${id}`)
  }

  reply.code(204).send()
}

async function getAllUsers (request, reply) {
  const collection = this.mongo.db.collection('users')
  const users = await collection.find({}).sort({
    _id: -1
  }).toArray()

  return users
}

async function getUserById (request, reply) {
  const collection = this.mongo.db.collection('users')
  const { ObjectId } = this.mongo
  const { id } = request.params

  const user = await collection.findOne({
    _id: new ObjectId(id)
  })

  if (!user) {
    return this.httpErrors.notFound('No user found')
  }

  return user
}

async function createUser (request, reply) {
  const collection = this.mongo.db.collection('users')
  const pwd = securePassword()

  const user = request.body
  const hashedPassword = await pwd.hash(Buffer.from(user.password))
  Object.assign(user, { password: hashedPassword })

  try {
    const data = await collection.insertOne(user)
    const _id = data.insertedId.toString()

    return { _id: _id }
  } catch (err) {
    // duplicate key error
    if (err.code === DUPLICATE_KEY_ERROR) {
      return this.httpErrors.badRequest(`username ${user.username}} already registered`)
    }

    return this.httpErrors.internalServerError(err.message)
  }
}

module.exports = {
  deleteUser,
  getAllUsers,
  getUserById,
  createUser
}
