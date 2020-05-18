'use strict'

const proxy = require('fastify-http-proxy')

module.exports = async function (fastify, opts) {
  fastify.register(proxy, {
    upstream: 'http://tickets-service:3002'
  })
}

module.exports.autoPrefix = '/api/ticket'