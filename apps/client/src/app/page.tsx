"use client";
import { useState, useEffect } from "react";
import { Todo } from "@treema-todo-assignment/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/todos";

export default function TodoPage() {
  // State for todos and form
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTodos(data);
      } catch {
        handleError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input }),
      });
      if (!res.ok) throw new Error();
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput("");
    } catch {
      handleError("Could not add task");
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      const updatedTodo = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      setEditingId(null);
    } catch {
      handleError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTodos(todos.filter((t) => t.id !== id));
    } catch {
      handleError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date to local string
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (loading)
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="flex items-center gap-sm">
          <div className="loading-spinner"></div>
          Loading...
        </span>
      </div>
    );

  return (
    <main className="p-lg m-auto" style={{ maxWidth: "900px" }}>
      {error && (
        <div
          className="bg-white p-md rounded shadow mb-md"
          style={{ borderLeft: "4px solid red", color: "red" }}
        >
          {error}
        </div>
      )}

      <div
        className="bg-white p-md rounded shadow"
        style={{ overflow: "hidden" }}
      >
        <h1 className="m-0 mb-md">Task Management</h1>

        {/* Create Form */}
        <form onSubmit={addTodo} className="flex gap-sm mb-md">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new task..."
          />
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>

        {/* Table Header */}
        <div className="grid-row table-header">
          <div className="text-center">Done?</div>
          <div>Title</div>
          <div>Timestamp</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Table Body */}
        <ul className="flex flex-col p-0">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li key={todo.id} className="grid-row border-b hover-bg">
                {/* Toggle */}
                <div className="text-center">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() =>
                        updateTodo(todo.id, { completed: !todo.completed })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Title & Instructions */}
                <div style={{ paddingRight: "1rem" }}>
                  {editingId === todo.id ? (
                    <>
                      {/* Edit */}
                      <input
                        className="input"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            updateTodo(todo.id, { title: editValue });
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <span className="hint-text">
                        Press Enter to save • Esc to cancel
                      </span>
                    </>
                  ) : (
                    <>
                      {/* View */}
                      <span
                        className={todo.completed ? "line-through" : ""}
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditValue(todo.title);
                        }}
                        style={{
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "1rem",
                        }}
                      >
                        {todo.title}
                      </span>
                      <span className="hint-text">Click to edit title</span>
                    </>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-sm">
                  <div style={{ color: "#444" }}>
                    {formatDate(todo.updatedAt)}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#ccc" }}>
                    Updated
                  </div>
                </div>

                {/* Delete */}
                <div className="text-center">
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-lg text-center text-sm">
              No tasks found. Add one above!
            </li>
          )}
        </ul>
      </div>
    </main>
  );
}
