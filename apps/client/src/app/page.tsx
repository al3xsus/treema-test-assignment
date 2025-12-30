"use client";
import { useState, useEffect } from "react";
import { Todo } from "@treema-todo-assignment/shared";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  // Fetch Todos
  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    if (res.ok) {
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput("");
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>My ToDos</h1>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "✅" : "⏳"}
          </li>
        ))}
      </ul>
    </main>
  );
}
