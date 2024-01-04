const express = require('express')
const userRouter = express.Router()

const { User } = require('../models')

// Get all users in the database
userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()

    if (!users) {
      throw new Error('No users found')
    }
    res.send({ users: users })
  } catch (error) {
    next(error)
  }
})

userRouter.get('/:username', async(req, res, next) => {
  const username = req.params

  try {
    const user = await User.findOrCreate({
      where: {
        userName: username.username
      }
    })

      if (!user) {
        throw new Error(`No user by username: ${username.username}`)
      }

      res.send({user: user})
  } catch (err) {
    next(err)
  }
})

module.exports = {
  userRouter
}
