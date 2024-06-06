const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


// event listener for the populate
// and every time we populate a user id, `.populate('owner')
// this event will trigger and delete the password
userSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password; // deletes the password
    return ret; // then just returns the document
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
