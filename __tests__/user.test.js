const { describe, test, expect, beforeAll } = require('@jest/globals') 

const { User } = require('../src/models')
const { seedSync } = require('../db/seed')

beforeAll(async () => {
    await seedSync()
})

describe('User model tests', () => {
    test('Should read all the users in the db', async() => {

    const userArr = await User.findAll()

    expect(Array.isArray(userArr)).toBe(true)
    expect(userArr[0]).toBeInstanceOf(User)
    })

    test('Should add a user to the User table', async() => {
        const pabs = await User.create({
            userName: 'Gigglet'
        })

        expect(pabs).toBeInstanceOf(User)
    })
})