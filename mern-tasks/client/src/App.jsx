import { useEffect, useState } from "react";

const API = "/api/tasks";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request(API)
      .then(setTasks)
      .catch(() => setError("Can't reach the server. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const task = await request(API, { method: "POST", body: JSON.stringify({ title }) });
      setTasks([task, ...tasks]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (task) => {
    const updated = await request(`${API}/${task._id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !task.done }),
    });
    setTasks(tasks.map((t) => (t._id === task._id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await request(`${API}/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );
  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <main className="wrap">
      <h1>Today's tasks</h1>
      <p className="count">
        {tasks.length === 0 ? "Nothing yet." : `${remaining} of ${tasks.length} left to do`}
      </p>

      <form onSubmit={addTask} className="add">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          maxLength={120}
          aria-label="New task"
        />
        <button type="submit">Add task</button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="filters" role="group" aria-label="Filter tasks">
        {["all", "active", "done"].map((f) => (
          <button
            key={f}
            className={filter === f ? "on" : ""}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : visible.length === 0 ? (
        <p className="empty">No tasks here. Add one above.</p>
      ) : (
        <ul className="list">
          {visible.map((task) => (
            <li key={task._id} className={task.done ? "done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task)}
                />
                <span>{task.title}</span>
              </label>
              <button className="del" onClick={() => deleteTask(task._id)} aria-label={`Delete ${task.title}`}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
