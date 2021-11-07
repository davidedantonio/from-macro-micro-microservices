'use strict'

const { test } = require('tap')
const { build, createUser, testWithLogin } = require('../helper')

test('signin error in username (not Found)', async (t) => {
  const app = build(t)

  await createUser(t, app, {
    username: 'username',
    password: 'password',
    fullName: 'Name LastName'
  })

  const res = await app.inject({
    url: '/signin',
    method: 'POST',
    body: {
      username: 'notFound',
      password: 'password'
    }
  })

  t.equal(res.statusCode, 404)
  t.same(JSON.parse(res.body), { message: 'username not found' })
})

test('sigin ok', async (t) => {
  const app = build(t)

  await createUser(t, app, {
    username: 'username',
    password: 'password',
    fullName: 'Name LastName'
  })

  const res = await app.inject({
    url: '/signin',
    method: 'POST',
    body: {
      username: 'username',
      password: 'password'
    }
  })

  t.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)
  const token = body.token
  t.ok(token)
})

test('sigin ko', async (t) => {
  const app = build(t)

  await createUser(t, app, {
    username: 'username',
    password: 'password',
    fullName: 'Name LastName'
  })

  const res = await app.inject({
    url: '/signin',
    method: 'POST',
    body: {
      username: 'username',
      password: 'wrong'
    }
  })

  t.equal(res.statusCode, 400)
  t.same(JSON.parse(res.body), { message: 'Invalid password' })
})

testWithLogin('Get user information', async (t, inject) => {
  const res = await inject({
    method: 'GET',
    url: '/me'
  })

  t.equal(res.statusCode, 200)
})
