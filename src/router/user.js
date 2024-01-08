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

// Search the db for a given user and if the user does not exist, create a new one
userRouter.get('/:username', async (req, res, next) => {
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

    res.send({ user: user })
  } catch (err) {
    next(err)
  }
})

// Take a wager from a user's shekelCount and give it to a specified winner
userRouter.put('/:username', async (req, res, next) => {
  // userWithBet is the person who places the bet or the bettor
  const userWithBet = req.params
  const { bet, winner } = req.body

  try {
    // Look into better error handling
    let bettor = await User.findOrCreate({
      where: {
        userName: userWithBet.username
      }
    })

    let betWinner = await User.findOrCreate({
      where: {
        userName: winner
      }
    })

    await bettor[0].update({
      shekelCount: (bettor[0].shekelCount -= bet)
    })

    await betWinner[0].update({
      shekelCount: (betWinner[0].shekelCount += bet)
    })

    // returns the bettor and betWinner AFTER the bet is transferred
    res.send({ users: [bettor, betWinner] })
  } catch (err) {
    next(err)
  }
})

module.exports = {
  userRouter
}
