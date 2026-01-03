import dotenv from "dotenv";
import path from "path";

import Koa, { Context, Next } from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import mongoose from "mongoose";
import { TodoSchema } from "@treema-todo-assignment/shared";
import { TodoModel } from "./models/Todo";

const app = new Koa();
const router = new Router();

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// DB Connection
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todo-db";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(cors());
app.use(bodyParser());

// Create
router.post("/todos", async (ctx: Context, next: Next) => {
  const result = TodoSchema.safeParse(ctx.request.body);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = { error: result.error.format() };
    return;
  }

  const newTodo = await TodoModel.create(result.data);
  ctx.status = 201;
  ctx.body = newTodo;
});

// Read
router.get("/todos", async (ctx: Context, next: Next) => {
  ctx.body = await TodoModel.find().sort({ createdAt: -1 });
});

// Update
router.patch("/todos/:id", async (ctx: Context, next: Next) => {
  const { id } = ctx.params;

  const result = TodoSchema.partial().safeParse(ctx.request.body);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = { error: result.error.format() };
    return;
  }

  // Check for empty or whitespace title
  if (result.data.title !== undefined && result.data.title.trim() === "") {
    ctx.status = 400;
    ctx.body = { error: "Title cannot be empty" };
    return;
  }

  const updatedTodo = await TodoModel.findByIdAndUpdate(id, result.data, {
    new: true,
  });

  ctx.body = updatedTodo;
});

// Delete
router.delete("/todos/:id", async (ctx: Context, next: Next) => {
  const { id } = ctx.params;
  await TodoModel.findByIdAndDelete(id);
  ctx.status = 204;
});

// Healthcheck
router.get("/", async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // shows how many seconds the server has been running
    environment: process.env.NODE_ENV || "development",
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    // Type the error as any or Error
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };
  }
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`🤖 Server on http://localhost:${PORT}`));
