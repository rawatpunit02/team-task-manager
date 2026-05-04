import { useEffect, useState } from "react";
import api from "../api/api.js";
import { getUser } from "../utils/auth.js";

const Projects = () => {
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", members: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchProjects = async () => {
    setError("");

    try {
      const response = await api.get("/api/projects");
      setProjects(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    if (isAdmin) {
      api
        .get("/api/auth/users?role=member")
        .then((response) => setUsers(response.data.data))
        .catch((err) => setError(err.message || "Failed to load users"));
    }
  }, []);

  const toggleMember = (userId) => {
    const members = form.members.includes(userId)
      ? form.members.filter((memberId) => memberId !== userId)
      : [...form.members, userId];

    setForm({ ...form, members });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCreating(true);

    try {
      await api.post("/api/projects", {
        name: form.name,
        members: form.members,
      });
      setForm({ name: "", members: [] });
      fetchProjects();
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold">Projects</h1>

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h2 className="font-medium text-slate-950">Create project</h2>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Project name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700">Members</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {users.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.members.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                  />
                  <span>
                    {member.name} ({member.email})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {creating ? "Creating..." : "Create Project"}
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
            No projects found.
          </p>
        ) : (
          projects.map((project) => (
            <article
              key={project._id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="font-medium text-slate-950">{project.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Created by: {project.createdBy?.name || "Unknown"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Members: {project.members?.length || 0}
              </p>
              {project.members?.length > 0 && (
                <p className="mt-2 text-sm text-slate-700">
                  {project.members.map((member) => member.name).join(", ")}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Projects;
