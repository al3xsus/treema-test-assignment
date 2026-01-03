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
      // transform: (doc, ret) => {
      //   const { _id, __v, ...rest } = ret;
      //   return {
      //     ...rest, // Spread the data first
      //     id: _id.toString(), // Overwrite or set the 'id' last
      //   };
      // },
      // Inside your transform function
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // Cast to string explicitly
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const TodoModel = model<Todo>("Todo", todoSchema);
