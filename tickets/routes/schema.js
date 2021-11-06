'use strict'

const S = require('fluent-json-schema')

const error = S.object()
  .prop('message', S.string())

const ticket = S.object()
  .prop('_id', S.string())
  .prop('subject', S.string())
  .prop('body', S.string())
  .prop('username', S.string())
  .prop('created_on', S.string().format('date-time'))

module.exports = {
  error,
  ticket
}
