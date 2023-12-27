const { describe, test, expect, beforeAll } = require('@jest/globals')

const { app } = require('../src/app')

const request = require('supertest')

describe('Testing the API endpoint', () => {
  test('GET all users', async () => {
    const response = await request(app).get('/api')

    console.log(response.body.users[1])

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('users')
    expect(Array.isArray(response.body.users)).toBe(true)

    response.body.users.forEach((user) => {
      expect(user).toHaveProperty('userName')
      expect(user).toHaveProperty('shekelCount')
    })
  })
})
