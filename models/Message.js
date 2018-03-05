const mongoose = require('mongoose')

const schema = mongoose.Schema({
  to: String,
  from: String,
  body: {
     text: String,
  },
  created_at: {
      type: Date,
      default: Date.now()
  },
  updated_at: {
      type: Date,
      default: Date.now()
  }
})

const Message = mongoose.model('Message', schema)

module.exports = { Message }
