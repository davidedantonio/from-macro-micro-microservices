'use strict'

const fp = require('fastify-plugin')
const S = require('fluent-schema')
const { 
  messageSchema
} = require('./../schema')

module.exports = fp(async function (fastify, opts) {
  fastify.addSchema(messageSchema)
})