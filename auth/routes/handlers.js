'use strict'

const securePassword = require('secure-password')

const DUPLICATE_KEY_ERROR = 11000

async function signup (request, reply) {
  const users = this.mongo.db.collection('users')
  const pwd = securePassword()

  const { fullName, username, password } = request.body
  const hashedPassword = await pwd.hash(Buffer.from(password))
  const profile = 'admin'

  try {
    await users.insertOne({
      fullName: fullName,
      username: username,
      password: hashedPassword,
      profile: profile
    })
  } catch (err) {
    // duplicate key error
    if (err.code === DUPLICATE_KEY_ERROR) {
      return this.httpErrors.notFound('username already registered')
    }
  }

  reply.code(204).send()
}

async function signin (request, reply) {
  const users = this.mongo.db.collection('users')
  const pwd = securePassword()

  const { username, password } = request.body
  const user = await users.findOne({ username: username })

  if (!user) {
    return this.httpErrors.notFound('username not found')
  }

  const res = await pwd.verify(Buffer.from(password), user.password.buffer)
  switch (res) {
    case securePassword.INVALID_UNRECOGNIZED_HASH:
      return this.httpErrors.badRequest('This hash was not made with secure-password. Attempt legacy algorithm')
    case securePassword.INVALID:
      return this.httpErrors.badRequest('Invalid password')
    case securePassword.VALID_NEEDS_REHASH:
      /* eslint-disable no-case-declarations */
      this.log.info({ username }, 'password needs rehashing')
      const hashedPassword = await pwd.hash(Buffer.from(password))
      await users.update({ _id: user._id }, { hashedPassword })
      break
      /* eslint-enable no-case-declarations */
  }

  const token = await reply.jwtSign({ username: username, fullName: user.fullName })
  return { token: token }
}

async function me (request) {
  return request.user
}

module.exports = {
  signup,
  signin,
  me
}
