import { Schema, model } from "mongoose";
import { Todo } from "@treema-todo-assignment/shared";

const todoSchema = new Schema<Todo>(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        const { _id, __v, ...rest } = ret;
        return {
          ...rest, // Spread the data first
          id: _id.toString(), // Overwrite or set the 'id' last
        };
      },
    },
  }
);

export const TodoModel = model<Todo>("Todo", todoSchema);
