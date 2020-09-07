'use strict'
const S = require('fluent-schema')
const securePassword = require('secure-password')

module.exports = async function(fastify, opts) {
  const pwd = securePassword()
  const usersCollection = fastify.mongo.db.collection('users')
  const { ObjectId } = fastify.mongo

  fastify.delete('/:id', {
    schema: {
      tags: ['users'],
      description: 'This method delete the user with specified id',
      params: S.object()
        .prop('id', S.string()
        .description("The user id to delete")
        .required()),
      response: {
        200: S.ref('#message'),
        404: S.ref('#message')
      }
    }
  }, async function (request, reply) {
    const { id } = request.params;
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      reply.code(404)
      return { message: 'No user found' }
    }

    return { message: `User ${id} deleted!` }
  })

  fastify.get('/', {
    schema: {
      tags: ['users'],
      description: 'Get all the users of the database',
      response: {
        200: S.array().items(
          S.object()
            .prop('username', S.string())
            .prop('fullName', S.string())
            .prop('_id', S.string())
        )
      }
    }
  }, async function (request, reply) {
    const users = await usersCollection.find({}).sort({
      _id: -1
    }).toArray()

    return users
  })

  fastify.get('/:id', {
    schema: {
      tags: ['users'],
      description: 'Get the user info with specified id',
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        200: S.object()
          .prop('username', S.string())
          .prop('fullName', S.string())
          .prop('_id', S.string()),
        404: S.ref('#message')
      }
    }
  }, async function (request, reply) {
    const { id } = request.params;
    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
      username: request.user.username
    })

    if (!user) {
      reply.code(404)
      return { message: 'No user found' }
    }

    return user
  })

  fastify.post('/', {
    schema: {
      tags: ['users'],
      description: 'Create a new user with the given information',
      body: S.object()
        .prop('username', S.string()
          .maxLength(10)
          .description("The preferred username")
          .required())
        .prop('password', S.string()
          .description("The password")
          .required())
        .prop('fullName', S.string()
          .maxLength(50)
          .description("The name of the user")
          .required()),
      response: {
        200: S.object()
          .prop('username', S.string())
          .prop('fullName', S.string())
          .prop('_id', S.string())
      }
    }
  }, async function (request, reply) {
    const user = request.body
    const hashedPassword = await pwd.hash(Buffer.from(user.password))
    Object.assign(user, { password: hashedPassword })
    
    const data = await usersCollection.insertOne(user)
    const _id = data.ops[0]._id

    return Object.assign({
      _id
    }, user)
  })
}
