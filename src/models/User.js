const { db, DataTypes } = require('../../db/connection')

const User = db.define(
  'User',
  {
    userId: DataTypes.STRING,
    userName: DataTypes.STRING,
    shekelCount: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    }
  },
  {
    timestamps: true
  }
)

module.exports = {
  User
}
