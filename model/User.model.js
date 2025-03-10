import mongoose from 'mongoose';

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

const User = mongoose.model('User', userSchema);

export default User;
