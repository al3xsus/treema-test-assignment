import { z } from "zod";

export const TodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof TodoSchema> & {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  _id?: string;
  __v?: string;
};
