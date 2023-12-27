const { describe, test, expect, beforeAll } = require('@jest/globals')

const { User } = require('../src/models')
const { seedSync } = require('../db/seed')

beforeAll(async () => {
  await seedSync()
})

describe('User model tests', () => {
  test('Should read all the users in the db', async () => {
    const userArr = await User.findAll()

    expect(Array.isArray(userArr)).toBe(true)
    expect(userArr[0]).toBeInstanceOf(User)
  })

  test('Should add a user to the User table', async () => {
    const newUser = await User.create({
      userName: 'N00b'
    })

    expect(newUser).toBeInstanceOf(User)
  })

  test('Should wager and modify the shekel count of the person wagering', async () => {
    // Because all users START with 100 shekels, we know what the values should be when a wager of 10 is  called by a new user
    const wager = 10
    let user = await User.findByPk(1)

    await user.update({
      shekelCount: (user.shekelCount -= wager)
    })

    expect(user).toBeInstanceOf(User)
    expect(user).toHaveProperty('shekelCount')
    expect(user.userName).toBe('PINCHE')
    expect(user.shekelCount).toBe(90)
  })

  test('Should accept a wager and give add to a users total', async () => {
    // userWager is refering to the same user as the previous test (id=1) and thus the amount of shekels is not the standard 100
    const wager = 15

    let userWager = await User.findByPk(1)
    let userReceiver = await User.findByPk(2)

    await userWager.update({
      shekelCount: (userWager.shekelCount -= wager)
    })

    await userReceiver.update({
      shekelCount: (userReceiver.shekelCount += wager)
    })

    expect(userWager).toBeInstanceOf(User)
    expect(userReceiver).toBeInstanceOf(User)

    expect(userWager).toHaveProperty('shekelCount')
    expect(userReceiver).toHaveProperty('shekelCount')

    expect(userWager.shekelCount).toBe(75)
    expect(userReceiver.shekelCount).toBe(115)
  })
})
