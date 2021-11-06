'use strict'

const S = require('fluent-json-schema')

const schema = require('./schema')

const {
  signup,
  signin,
  me
} = require('./handlers')

module.exports = async function (fastify, opts) {
  const users = fastify.mongo.db.collection('users')
  await users.createIndex({
    username: 1
  }, { unique: true })

  fastify.post('/signup', {
    schema: {
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
        204: S.null(),
        400: schema.error
      }
    }
  }, signup)

  fastify.post('/signin', {
    schema: {
      body: S.object()
        .prop('username', S.string()
          .description('The preferred username')
          .required())
        .prop('password', S.string()
          .description('The user password')
          .required()),
      response: {
        200: schema.token,
        404: schema.error,
        400: schema.error
      }
    }
  }, signin)

  fastify.get('/me', {
    schema: {
      response: {
        200: S.object()
          .prop('username', S.string())
          .prop('fullName', S.string())
          .prop('profile', S.string())
      }
    }
  }, me)
}
