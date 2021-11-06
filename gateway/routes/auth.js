'use strict'

const proxy = require('fastify-http-proxy')
const isDocker = require('is-docker')

module.exports = async function (fastify, opts) {
  const url = isDocker() ? 'auth-service' : 'localhost'
  fastify.register(proxy, {
    upstream: `http://${url}:3001`
  })
}
