'use strict'

const fp = require('fastify-plugin')
const isDocker = require('is-docker')
const MongoDB = require('fastify-mongodb')

module.exports = fp(async (fastify, opts) => {
  let mongoOpts = Object.assign({}, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: process.env.MONGODB_URL || `mongodb://${isDocker() ? 'mongodb-web' : 'localhost'}:27017/wetalk`,
  }, opts.mongodb)

  fastify.register(MongoDB, mongoOpts)
})