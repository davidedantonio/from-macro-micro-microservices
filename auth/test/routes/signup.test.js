'use strict'

const { test } = require('tap')
const { build, createUser } = require('../helper')

test('signup without username', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/signup',
    method: 'POST',
    body: {
      password: 'foo',
      fullName: 'Name LastName'
    }
  })

  t.equal(res.statusCode, 400)
  t.same(JSON.parse(res.body), { message: "body should have required property 'username'" })
})

test('signup without password', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/signup',
    method: 'POST',
    body: {
      username: 'foo',
      fullName: 'Name LastName'
    }
  })

  t.equal(res.statusCode, 400)
  t.same(JSON.parse(res.body), { message: "body should have required property 'password'" })
})

test('signup without password', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/signup',
    method: 'POST',
    body: {
      username: 'foo',
      password: 'secret'
    }
  })

  t.equal(res.statusCode, 400)
  t.same(JSON.parse(res.body), { message: "body should have required property 'fullName'" })
})

test('signup and check', async (t) => {
  const app = build(t)

  await createUser(t, app, {
    username: 'username',
    password: 'password',
    fullName: 'Name LastName'
  })

  const resInError = await app.inject({
    url: '/signup',
    method: 'POST',
    body: {
      username: 'username',
      password: 'password',
      fullName: 'Name LastName'
    }
  })

  t.equal(resInError.statusCode, 400)
  t.same(JSON.parse(resInError.body), { message: 'username already registered' })
})
