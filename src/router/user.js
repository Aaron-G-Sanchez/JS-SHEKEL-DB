const express = require('express')
const userRouter = express.Router()

const { User } = require('../models')

// Get all users in the database
userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()

    if (!users) {
      throw new error('No users found')
    }
    res.send({ users: users })
  } catch (error) {
    next(error)
  }
})

module.exports = {
  userRouter
}
