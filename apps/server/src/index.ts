import "dotenv/config";
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import mongoose from "mongoose";
import { TodoSchema } from "@treema-todo-assignment/shared";
import { TodoModel } from "./models/Todo";

const app = new Koa();
const router = new Router();

// 1. Connect to MongoDB
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todo-db";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(cors());
app.use(bodyParser());

// 2. Routes
router.post("/todos", async (ctx) => {
  // Validate incoming data using Zod
  const result = TodoSchema.safeParse(ctx.request.body);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = { error: result.error.format() };
    return;
  }

  // Save to Database
  const newTodo = await TodoModel.create(result.data);
  ctx.status = 201;
  ctx.body = newTodo;
});

router.get("/todos", async (ctx) => {
  ctx.body = await TodoModel.find().sort({ createdAt: -1 });
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
