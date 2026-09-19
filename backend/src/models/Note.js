import mongoose from "mongoose";

// 1. Create a schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

// 2. Create a model based on the schema
const Note = mongoose.model("Note", noteSchema);

export default Note;