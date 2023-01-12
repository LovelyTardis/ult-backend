import { Schema, model } from "mongoose";

const UltSchema = Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  datetime: {
    type: Number,
    required: [true, "Datetime is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  ult: {
    type: Schema.Types.ObjectId,
    ref: "Ult",
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array(Schema.Types.ObjectId),
    ref: "Ult",
    default: [],
  },
});

export default model("Ult", UltSchema);
