const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals')

const { app } = require('../src/app')
const { seedSync } = require('../db/seed')

const request = require('supertest')

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

  // test('PUT / update a bettor and a betWinners shekelCount', async () => {
  //   const bettor = 'testUserOne'
  //   const betWinner = 'testUserTwo'
  //   const bet = 10

  //   const response = await request(app)
  //     .put(`/users/${bettor}`)
  //     .send({ bet, winner: betWinner })
  //     .expect(200)

  //   // console.log(JSON.stringify(response.body, 0, 2))
  // })
})
