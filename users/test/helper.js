'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')
const { beforeEach, teardown, test } = require('tap')
const jwt = require('jsonwebtoken')
const clean = require('mongo-clean')
const { MongoClient } = require('mongodb')
const dbName = 'tests'
const dbUrl = 'mongodb://localhost:27017'

let client

beforeEach(async function () {
  if (!client) {
    client = await MongoClient.connect(dbUrl, {
      w: 1,
      useNewUrlParser: true
    })
  }

  await clean(client.db(dbName))
})

teardown(async function () {
  if (client) {
    await client.close()
    client = null
  }
})

function testWithLogin (name, fn) {
  test(name, async (t) => {
    const app = build(t)
    const conf = config()

    const token = jwt.sign({
      username: 'username',
      fullName: 'Name LastName'
    }, conf.jwt.secret)

    function inject (opts) {
      opts = opts || {}
      opts.headers = opts.headers || {}
      opts.headers.authorization = `Bearer ${token}`
      return app.inject(opts)
    }

    return fn(t, inject)
  })
}

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    jwt: {
      secret: 'Th1s1sT35tS3cr3t'
    },
    mongodb: {
      client,
      database: dbName
    }
  }
}

function build (t) {
  const app = Fastify({
    logger: {
      level: 'error'
    }
  })

  app.register(fp(App), config())

  t.teardown(app.close.bind(app))
  return app
}

module.exports = {
  config,
  build,
  testWithLogin
}
