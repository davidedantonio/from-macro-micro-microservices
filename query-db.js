'use strict'

const axios = require('axios');
const client = axios.create({
  baseURL: 'http://localhost:3000'
})

async function createUser () {
  let user = Object.assign({}, {
    username: 'ddantonio',
    password: 'pippo',
    fullName: 'Davide D Antonio'
  })

  try {
    const response = await client.post('/signup', user)
    return response.token;
  } catch (e) {
    console.log(e.response.data.message)

    if (e.response.status !== 400) {
      process.exit(1)
    }
  }

  console.log('Try to login')
  delete user.fullName
  const response = await client.post('/signin', user)
  return response.data.token
}

async function generateTicketTraffic (token) {
  const requestConfig = {
    headers: {'Authorization': `Bearer ${token}`}
  }

  try {
    for (let i = 0; i < 100; i++) {
      const response = await client.post('/api/ticket', {
        subject: `This is subject #${i}`,
        body: `This is body #${i}`
      }, requestConfig)

      console.log(`Ticket #${i} created!`)

      if (i % 2 === 0) {
        await client.get('/api/ticket', requestConfig )
      } else if (i % 3 === 0) {
        await client.get(`/api/ticket/${response.data._id}`, requestConfig)
      } else {
        await client.delete(`/api/ticket/${response.data._id}`, requestConfig)
      }
    }
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

async function generateUserTraffic (token) {
  const requestConfig = {
    headers: {'Authorization': `Bearer ${token}`}
  }

  try {
    for (let i = 0; i < 100; i++) {
      const response = await client.post('/api/user', {
        username: `user_${i}`,
        password: 'foo',
        fullName: 'John Doe'
      }, requestConfig)

      console.log(`User #${i} created!`)
      await client.get('/api/user', requestConfig )
      await client.get(`/api/user/${response.data._id}`, requestConfig)
      await client.delete(`/api/user/${response.data._id}`, requestConfig)
    }
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

async function generateData () {
  const token = await createUser()
  console.log('Token generated successfully!')
  await generateTicketTraffic(token);
  await generateUserTraffic(token);
}

generateData()
  .catch(e => console.error)
