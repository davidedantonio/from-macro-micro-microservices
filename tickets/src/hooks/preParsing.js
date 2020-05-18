'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async (fastify, opts) => {
  fastify.addHook('preParsing', async (request, reply) => {
    return request.jwtVerify()
  })
})
