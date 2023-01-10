import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  ults: {
    type: Array(Schema.Types.ObjectId),
    ref: "Ult",
    default: [],
  },
  likedUlts: {
    type: Array(Schema.Types.ObjectId),
    ref: "Ult",
    default: [],
  },
});

export default model("User", UserSchema);
