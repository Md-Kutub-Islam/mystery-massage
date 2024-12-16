// Document is the part of the mongoose we this when we use typescript
import mongoose, { Schema, Document } from "mongoose";

// here is we use document, because we make document
export interface Message extends Document {
  content: string; // this is document
  createdAt: Date; // this is document
}

// Schema<Message> meaning of this syntax is we give the type of MessageSchema
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerifyed: boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a vali d email address"],
  },
  password: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code Expiry is required"],
  },
  isVerifyed: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  message: [MessageSchema],
});

// IN nextjs we can export model in two way. The first one, if the object is already created so return only and the scound if the object is not created then create first and return
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
