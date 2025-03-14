import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: { type: String, require: true },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    isVerified: { type: Boolean, default: false },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: { type: Date },

    verificationToken: { type: String },
  },
  { timestamps: true }
);

// encrypt password using bcrypt before save into the database
userSchema.pre('save', async function (next) {
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
