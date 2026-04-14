import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['alumni', 'student', 'admin'],
    default: 'student',
  },
  // Common fields
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },

  // Alumni-specific
  graduationYear: { type: Number },
  company: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  industry: { type: String, default: '' },
  linkedIn: { type: String, default: '' },

  // Student-specific
  enrollmentYear: { type: Number },
  major: { type: String, default: '' },
  expectedGraduation: { type: Number },



  isApproved: { type: Boolean, default: true }, // admin can disable
  isActive:   { type: Boolean, default: true  },
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);