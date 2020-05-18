'use strict'

const proxy = require('fastify-http-proxy')

module.exports = async function (fastify, opts) {
  fastify.register(proxy, {
    upstream: 'http://users-service:3003'
  })
}

module.exports.autoPrefix = '/api/user'