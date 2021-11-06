'use strict'

const S = require('fluent-json-schema')

const error = S.object()
  .prop('message', S.string())

const token = S.object()
  .prop('token', S.string())

module.exports = {
  error,
  token
}
