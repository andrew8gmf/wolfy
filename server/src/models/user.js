const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Friends = require('./friends');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  emailConfirmationToken: {
    type: String,
    select: false,
  },
  emailConfirmationExpires: {
    type: Date,
    select: false,
  },
  isVerified: {
    type: Boolean,
    select: false,
    default: false,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friends" }]
}, {timestamps: true});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10); 
  this.password = hash;

  next();
});

module.exports = mongoose.model('User', UserSchema);