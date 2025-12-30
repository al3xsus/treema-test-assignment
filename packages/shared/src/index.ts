import { z } from "zod";

export const TodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema> & {
  id: string; // No 'readonly'
  createdAt: Date;
  updatedAt: Date;
  _id?: any; // Optional so it can be deleted
  __v?: any; // Optional so it can be deleted
};
