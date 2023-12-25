const { User } = require('../src/models')
const { db } = require('../db/connection')

const seedSync = async () => {
    console.log("Loading...")

    const users = [ {
        userName: "PINCHE"
    }, {
        userName: "Opal"
    }]

    await db.sync({ force: true })
    await User.bulkCreate(users)
    
    console.log("Seed has been planted!")
}

// seedSync()

module.exports = {
    seedSync
}