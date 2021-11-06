'use strict'

const fp = require('fastify-plugin')
const JWT = require('fastify-jwt')

module.exports = fp(async (fastify, opts) => {
  const jwtOpts = Object.assign({}, {
    secret: process.env.JWT_SECRET || 'Th1s1sY0ur53cr3t'
  }, opts.jwt)

  fastify.register(JWT, jwtOpts)
})
