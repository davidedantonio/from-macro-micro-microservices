'use strict'

const S = require('fluent-json-schema')
const {
  createTicket,
  getTicketById,
  getAllTickets,
  deleteTicket
} = require('./handlers')
const schema = require('./schema')

module.exports = async function (fastify, opts) {
  fastify.delete('/:id', {
    schema: {
      tags: ['tickets'],
      description: 'This method delete the ticket with specified id',
      params: S.object()
        .prop('id', S.string()
          .description('The ticket id to delete')
          .required()),
      response: {
        204: S.null(),
        404: schema.error
      }
    }
  }, deleteTicket)

  fastify.get('/', {
    schema: {
      tags: ['tickets'],
      description: 'Get all the tickets from the database',
      response: {
        200: S.array().items(schema.ticket),
        404: schema.error
      }
    }
  }, getAllTickets)

  fastify.get('/:id', {
    schema: {
      tags: ['tickets'],
      description: 'Get the ticket info with specified id',
      params: S.object()
        .prop('id', S.string().required()),
      response: {
        200: schema.ticket,
        404: schema.error
      }
    }
  }, getTicketById)

  fastify.post('/', {
    schema: {
      tags: ['tickets'],
      description: 'Create a new ticket with the given information',
      body: S.object()
        .prop('subject', S.string().required())
        .prop('body', S.string().required()),
      response: {
        200: schema.ticket
      }
    }
  }, createTicket)
}
