'use strict'

const proxy = require('fastify-http-proxy')
const isDocker = require('is-docker')

module.exports = async function (fastify, opts) {
  const url = isDocker() ? 'users-service' : 'localhost'
  fastify.register(proxy, {
    upstream: `http://${url}:3003`
  })
}

module.exports.autoPrefix = '/api/user'
