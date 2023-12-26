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

    // Because all users START with 100 shekels, we know what the values should be when a wager of 10 is  called by a new user
    test('Should wager and modify the shekel count', async() => {
        const wager = 10

        let user = await User.findByPk(1)

        await user.update({
            skekelCount: user.shekelCount -= wager
        })

        expect(user).toHaveProperty('shekelCount')
        expect(user.shekelCount).toBe(90)
    })
})