const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals')

const { User } = require('../src/models')
const { seedSync } = require('../db/seed')

beforeAll(async () => {
  await seedSync()
})

afterAll(async () => {
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
    let user = await User.create({
      userName: 'N00b'
    })

    await user.update({
      shekelCount: (user.shekelCount -= wager)
    })

    expect(user).toBeInstanceOf(User)
    expect(user).toHaveProperty('shekelCount')
    expect(user.userName).toBe('N00b')
    expect(user.shekelCount).toBe(90)
  })

  test('Should accept a wager and give add to a users total', async () => {
    const wager = 10
    // UserWager and userReceiver are referring to the two users creted when the repo was started
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

    expect(userWager.shekelCount).toBe(90)
    expect(userReceiver.shekelCount).toBe(110)
  })
})
