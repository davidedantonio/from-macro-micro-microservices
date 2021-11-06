'use strict'

const S = require('fluent-json-schema')

const error = S.object()
  .prop('message', S.string())

const basicUserInfo = S.object()
  .prop('username', S.string())
  .prop('fullName', S.string())
  .prop('_id', S.string())

module.exports = {
  error,
  basicUserInfo
}
