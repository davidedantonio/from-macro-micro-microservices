'use strict'

const S = require('fluent-json-schema')

const schema = require('./schema')
const {
  deleteUser,
  getAllUsers,
  getUserById,
  createUser
} = require('./handlers')

module.exports = async function (fastify, opts) {
  const users = fastify.mongo.db.collection('users')
  await users.createIndex({
    username: 1
  }, { unique: true })

  fastify.delete('/:id', {
    schema: {
      tags: ['users'],
      description: 'This method delete the user with specified id',
      params: S.object()
        .prop('id', S.string()
          .description('The user id to delete')
          .required()),
      response: {
        204: S.null(),
        404: schema.error
      }
    }
  }, deleteUser)

  fastify.get('/', {
    schema: {
      tags: ['users'],
      description: 'Get all the users of the database',
      response: {
        200: S.array().items(
          schema.basicUserInfo
        )
      }
    }
  }, getAllUsers)

  fastify.get('/:id', {
    schema: {
      tags: ['users'],
      description: 'Get the user info with specified id',
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        200: schema.basicUserInfo,
        404: schema.error,
        500: schema.error
      }
    }
  }, getUserById)

  fastify.post('/', {
    schema: {
      tags: ['users'],
      description: 'Create a new user with the given information',
      body: S.object()
        .prop('username', S.string()
          .maxLength(10)
          .description('The preferred username')
          .required())
        .prop('password', S.string()
          .description('The password')
          .required())
        .prop('fullName', S.string()
          .maxLength(50)
          .description('The name of the user')
          .required()),
      response: {
        200: S.object()
          .prop('_id', S.string()),
        400: schema.error
      }
    }
  }, createUser)
}
