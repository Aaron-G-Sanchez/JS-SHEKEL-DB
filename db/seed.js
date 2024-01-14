const { User } = require('../src/models')
const { db } = require('../db/connection')

const seedSync = async () => {
  // console.log('Loading...')

  const users = [
    {
      userId: '400151152760717333',
      userName: 'PINCHE'
    },
    {
      userId: '400151152760717334',
      userName: 'Opal'
    }
  ]

  await db.sync({ force: true })
  await User.bulkCreate(users)

  // console.log('Seed has been planted!')
}

// seedSync()

module.exports = {
  seedSync
}
