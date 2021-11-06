'use strict'

const isDocker = require('is-docker')
const apm = require('elastic-apm-node')
require('dotenv').config()

const port = process.env.APM_PORT || 8200
const apmUrl = process.env.APM_URL || isDocker() ? 'apm-server' : 'localhost'

apm.start({
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: `http://${apmUrl}:${port}`
})
