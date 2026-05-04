import { useEffect, useState } from "react";
import api from "../api/api.js";
import { getUser } from "../utils/auth.js";

const statuses = ["todo", "in-progress", "done"];

const Tasks = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  const fetchTasks = async () => {
    setError("");

    try {
      const response = await api.get("/api/tasks");
      setTasks(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    if (isAdmin) {
      Promise.all([
        api.get("/api/projects"),
        api.get("/api/auth/users?role=member"),
      ])
        .then(([projectsResponse, usersResponse]) => {
          setProjects(projectsResponse.data.data);
          setUsers(usersResponse.data.data);
        })
        .catch((err) => setError(err.message || "Failed to load form data"));
    }
  }, []);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError("");
    setCreating(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await api.post("/api/tasks", {
        ...form,
        dueDate: today,
      });
      setForm({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
      });
      fetchTasks();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    setError("");
    setUpdatingTaskId(taskId);

    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setUpdatingTaskId("");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <button
          onClick={fetchTasks}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleCreateTask}
          className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h2 className="font-medium text-slate-950">Create task</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
              required
            />
            <select
              value={form.projectId}
              onChange={(event) =>
                setForm({ ...form, projectId: event.target.value })
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={form.assignedTo}
              onChange={(event) =>
                setForm({ ...form, assignedTo: event.target.value })
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
              required
            >
              <option value="">Assign to</option>
              {users.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="mt-3 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={creating}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {creating ? "Creating..." : "Create Task"}
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
            {isAdmin ? "No tasks found." : "No tasks assigned to you."}
          </p>
        ) : (
          tasks.map((task) => (
            <article
              key={task._id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-medium text-slate-950">{task.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Project: {task.projectId?.name || "Unknown"}
                    <span className="mx-2">•</span>
                    Assigned to: {task.assignedTo?.name || "Unknown"}
                  </p>
                </div>

                <select
                  value={task.status}
                  disabled={updatingTaskId === task._id}
                  onChange={(event) =>
                    updateStatus(task._id, event.target.value)
                  }
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Tasks;
