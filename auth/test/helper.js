'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')
const { beforeEach, teardown, test } = require('tap')
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

// automatically build and tear down our instance
function build (t) {
  const app = Fastify({
    logger: {
      level: 'error'
    }
  })

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}

async function createUser (t, app, { username, password, fullName }) {
  const res = await app.inject({
    url: '/signup',
    method: 'POST',
    body: {
      username,
      password,
      fullName
    }
  })

  t.deepEqual(res.statusCode, 204)
}

async function login (t, app, { username, password }) {
  const res = await app.inject({
    url: '/signin',
    method: 'POST',
    body: {
      username: username,
      password: password
    }
  })

  const body = JSON.parse(res.body)
  return body.token
}

function testWithLogin (name, fn) {
  test(name, async (t) => {
    const app = build(t)

    await createUser(t, app, {
      username: 'username',
      password: 'password',
      fullName: 'Name LastName'
    })

    const token = await login(t, app, {
      username: 'username',
      password: 'password'
    })

    function inject (opts) {
      opts = opts || {}
      opts.headers = opts.headers || {}
      opts.headers.authorization = `Bearer ${token}`

      return app.inject(opts)
    }

    return fn(t, inject)
  })
}

module.exports = {
  config,
  build,
  createUser,
  testWithLogin
}
