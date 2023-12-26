const express = require('express')
const app = express()

const { userRouter } = require('../src/router/user')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', userRouter)

module.exports = {
  app
}
