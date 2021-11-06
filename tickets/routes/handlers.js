'use strict'

async function createTicket (request, reply) {
  const collection = this.mongo.db.collection('tickets')

  const ticket = request.body
  Object.assign(ticket, {
    username: request.user.username,
    created_on: new Date()
  })

  const data = await collection.insertOne(ticket)
  const _id = data.ops[0]._id

  return Object.assign(ticket, {
    _id
  })
}

async function getTicketById (request, reply) {
  const collection = this.mongo.db.collection('tickets')
  const { ObjectId } = this.mongo

  const { id } = request.params
  const ticket = await collection.findOne({
    _id: new ObjectId(id),
    username: request.user.username
  })

  if (!ticket) {
    return this.httpErrors.notFound(`No ticket found with id ${id}`)
  }

  return ticket
}

async function getAllTickets (request, reply) {
  const collection = this.mongo.db.collection('tickets')

  const tickets = await collection.find({
    username: request.user.username
  }).sort({
    _id: -1 // new tickets first
  }).toArray()

  return tickets
}

async function deleteTicket (request, reply) {
  const collection = this.mongo.db.collection('tickets')
  const { ObjectId } = this.mongo
  const { id } = request.params

  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    username: request.user.username
  })

  if (result.deletedCount === 0) {
    return this.httpErrors.notFound(`No ticket found with id ${id}`)
  }

  reply
    .code(204)
    .send()
}

module.exports = {
  deleteTicket,
  getAllTickets,
  createTicket,
  getTicketById
}
