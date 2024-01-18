const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals')

const { app } = require('../src/app')
const { seedSync } = require('../db/seed')

const request = require('supertest')
const { json } = require('sequelize')

beforeAll(async () => {
  await seedSync()
})

afterAll(async () => {
  await seedSync()
})

describe('Testing the API endpoint', () => {
  test('GET all users', async () => {
    const response = await request(app).get('/users').expect(200)

    expect(response.body).toHaveProperty('users')
    expect(Array.isArray(response.body.users)).toBe(true)

    response.body.users.forEach((user) => {
      expect(user).toHaveProperty('userName')
      expect(user).toHaveProperty('userId')
      expect(user).toHaveProperty('shekelCount')
    })
  })

  test('GET a user by userId', async () => {
    const userId = '400151152760717333'
    const userName = 'PINCHE'
    const response = await request(app)
      .get(`/users/${userId}/${userName}`)
      .expect(200)

    // expect(response.status).toBe(200)
    expect(response.body.user).toHaveProperty('userName')
    expect(response.body.user).toHaveProperty('shekelCount')
  })

  test('PUT / update a bettor and a betWinners shekelCount', async () => {
    // Bettor info
    const bettorId = '400151152760717337'
    const bettorUsername = 'testUserOne'
    // Bet winner info
    const betWinnerId = '400151152760717338'
    const betWinnerUsername = 'testUserTwo'
    // Bet amount
    const bet = 10

    const response = await request(app)
      .put(`/users/${bettorId}/${bettorUsername}`)
      .send({
        bet,
        winner: {
          userId: betWinnerId,
          userName: betWinnerUsername
        }
      })
      .expect(200)

    expect(Array.isArray(response.body.message)).toBe(true)

    // Becasue the two users are being created in this test
    // The defualt shekelCount will be 100 thus we know what
    // The values after the bet is applied
    expect(response.body.message[0].shekelCount).toBe(90)
    expect(response.body.message[1].shekelCount).toBe(110)

    response.body.message.forEach((user) => {
      expect(user).toHaveProperty('userName')
      expect(user).toHaveProperty('userId')
      expect(user).toHaveProperty('shekelCount')
    })
  })

  test('PUT / update a bettor should throw error when trying to donate to oneself', async () => {
    // Better info
    // Looking for an error when this is the bettor and the bet winner
    // only declaring one user here satifies the requirements
    const userId = '400151152760717335'
    const username = 'Opal'

    const bet = 10

    const response = await request(app)
      .put(`/users/${userId}/${username}`)
      .send({
        bet,
        winner: {
          userId,
          userName: username
        }
      })
      .expect(400)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe(`Sorry! You can't donate to yourself!`)
  })

  test('PUT / update a better should throw an error when a users shekelCount is less than the bet amount', async () => {
    // Bettor info
    const bettorId = '400151152760717337'
    const bettorUsername = 'testUserOne'
    // Bet winner info
    const betWinnerId = '400151152760717338'
    const betWinnerUsername = 'testUserTwo'
    // Bet amount
    const bet = 100

    const response = await request(app)
      .put(`/users/${bettorId}/${bettorUsername}`)
      .send({
        bet,
        winner: {
          userId: betWinnerId,
          userName: betWinnerUsername
        }
      })
      .expect(400)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe(
      `Sorry! You can't donate more than you have!`
    )
  })

  test('PUT / should throw and error when trying to donate a non integer number', async () => {
    // Bettor info
    const bettorId = '400151152760717337'
    const bettorUsername = 'testUserOne'
    // Bet winner info
    const betWinnerId = '400151152760717338'
    const betWinnerUsername = 'testUserTwo'
    // Bet amount
    const bet = -10

    const response = await request(app)
      .put(`/users/${bettorId}/${bettorUsername}`)
      .send({
        bet,
        winner: {
          userId: betWinnerId,
          userName: betWinnerUsername
        }
      })
      .expect(400)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe("Sorry! You can't donate -shekels!")
  })
})
