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

// Search the db for a given user by their userId and userName
// If the user does not exist, create a new one
userRouter.get('/:userId/:userName', async (req, res, next) => {
  const { userId, userName } = req.params

  try {
    const user = await User.findOne({
      where: {
        userId: userId,
        userName: userName
      }
    })

    if (!user) {
      const newUser = await User.create({
        userId: userId,
        userName: userName
      })
      res.send({ user: newUser })
      return
    }

    res.send({ user: user })
  } catch (err) {
    next(err)
  }
})

// Take a wager from a user's shekelCount and give it to a specified winner
userRouter.put('/:userId/:userName', async (req, res, next) => {
  // userWithBet is the person who places the bet or the bettor
  const { userId, userName } = req.params
  const { bet, winner } = req.body

  // Quick and fast fix. Need to check other ways of implementation
  if (userId === winner.userId && userName === winner.userName) {
    res.status(400)
    res.send({
      error: `Sorry! You can't donate to yourself!`
    })
    return
  } else if (bet < 0) {
    res.status(400)
    res.send({
      error: `Sorry! You can't donate -shekels!`
    })
    return
  }

  try {
    // Look into better error handling
    let bettor = await User.findOrCreate({
      where: {
        userId: userId,
        userName: userName
      }
    })

    let betWinner = await User.findOrCreate({
      where: {
        userId: winner.userId,
        userName: winner.userName
      }
    })

    if (bet >= bettor[0].shekelCount) {
      res.status(400)
      res.send({
        error: `Sorry! You can't donate more than you have!`
      })
      return
    }

    await bettor[0].update({
      shekelCount: (bettor[0].shekelCount -= bet)
    })

    await betWinner[0].update({
      shekelCount: (betWinner[0].shekelCount += bet)
    })

    // Returns the bettor and betWinner AFTER the bet is transferred
    // Might update to just be a string saying bet was placed
    // Need to see what this looks like on discords end
    res.send({
      message: [bettor[0], betWinner[0]]
    })
  } catch (err) {
    next(err)
  }
})

module.exports = {
  userRouter
}
