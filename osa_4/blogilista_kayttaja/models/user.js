import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  }
})

// Muunna toJSON siten että id näkyy ja passwordHash ym. poistuvat
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash // älä paljasta hashia
  }
})

const User = mongoose.model('User', userSchema)
export default User
