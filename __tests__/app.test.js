const { describe, test, expect, beforeAll } = require('@jest/globals')

const { app } = require('../src/app')

const request = require('supertest')

describe('Testing the API endpoint', () => {
  test('GET all users', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('users')
    expect(Array.isArray(response.body.users)).toBe(true)

    response.body.users.forEach((user) => {
      expect(user).toHaveProperty('userName')
      expect(user).toHaveProperty('shekelCount')
    })
  })

  test('GET a user by username', async () => {
    const username = "PINCHE"
    const response = await request(app).get(`/users/${username}`)

    expect(response.status).toBe(200)
    expect(response.body.user[0]).toHaveProperty('userName')
    expect(response.body.user[0]).toHaveProperty('shekelCount')
  })
})
