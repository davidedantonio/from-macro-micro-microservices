'use strict'

const fp = require('fastify-plugin')
const isDocker = require('is-docker')
const MongoDB = require('fastify-mongodb')

module.exports = fp(async (fastify, opts) => {
  const port = process.env.MONGO_PORT || 27017
  const dbUrl = process.env.MONGO_URL || `${isDocker() ? 'mongodb-web' : 'localhost'}:${port}/macro-to-micro`

  const mongoOpts = Object.assign({}, {
    forceClose: true,
    useNewUrlParser: true,
    url: `mongodb://${dbUrl}`
  }, opts.mongodb)

  fastify.register(MongoDB, mongoOpts)
})
