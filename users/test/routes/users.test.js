'use strict'

const { testWithLogin } = require('../helper')

const fakeUser = {
  username: 'username',
  password: 'password',
  fullName: 'Name LastName'
}

const fakeUser2 = {
  username: 'username2',
  password: 'password2',
  fullName: 'Name LastName'
}

testWithLogin('Create a new user', async (t, inject) => {
  const res = await inject({
    url: '/',
    method: 'POST',
    body: fakeUser
  })

  t.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)
  t.ok(body._id)

  const resError = await inject({
    url: '/',
    method: 'POST',
    body: fakeUser
  })

  t.equal(resError.statusCode, 400)
})

testWithLogin('Create and get user', async (t, inject) => {
  const res = await inject({
    url: '/',
    method: 'POST',
    body: fakeUser
  })

  t.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)

  const userResponse = await inject({
    url: `/${body._id}`,
    method: 'GET'
  })

  t.equal(userResponse.statusCode, 200)

  const user = JSON.parse(userResponse.body)
  t.same(user, {
    username: fakeUser.username,
    fullName: fakeUser.fullName,
    _id: body._id
  })
})

testWithLogin('Invalid User', async (t, inject) => {
  let userResponse = await inject({
    url: '/123456789011',
    method: 'GET'
  })

  t.equal(userResponse.statusCode, 404)
  t.same(JSON.parse(userResponse.body), { message: 'No user found' })

  userResponse = await inject({
    url: '/123456789011',
    method: 'DELETE'
  })

  t.equal(userResponse.statusCode, 404)
  t.same(JSON.parse(userResponse.body), { message: 'No user found with id 123456789011' })

  userResponse = await inject({
    url: '/invalidIdentifier',
    method: 'GET'
  })

  t.equal(userResponse.statusCode, 500)
  t.same(JSON.parse(userResponse.body), { message: 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters' })
})

testWithLogin('Create and delete user', async (t, inject) => {
  let res = await inject({
    url: '/',
    method: 'POST',
    body: fakeUser
  })

  const body = JSON.parse(res.body)
  res = await inject({
    url: `/${body._id}`,
    method: 'DELETE'
  })

  t.equal(res.statusCode, 204)
})

testWithLogin('Create users and get all', async (t, inject) => {
  await inject({
    url: '/',
    method: 'POST',
    body: fakeUser
  })

  await inject({
    url: '/',
    method: 'POST',
    body: fakeUser2
  })

  const res = await inject({
    url: '/',
    method: 'GET'
  })
  const body = JSON.parse(res.body)

  t.equal(res.statusCode, 200)
  t.equal(body.length, 2)
})
