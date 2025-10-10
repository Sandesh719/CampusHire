import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api/v1"; // change if needed

export const Portfolio = () => {
  const { loading, isLogin } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [portfolioData, setPortfolioData] = useState({
    githubLink: "",
    linkedinLink: "",
    portfolioLink: "",
    bio: "",
    projects: [],
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    projectLink: "",
    technologies: "",
  });

  const [saving, setSaving] = useState(false);

  // Fetch portfolio details
  useEffect(() => {
    if (!isLogin) navigate("/login");
    else fetchPortfolioData();
  }, [isLogin, navigate]);

  const fetchPortfolioData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };
      const { data } = await axios.get(`${API_BASE_URL}/portfolio`, config);
      if (data.success && data.user) {
        const u = data.user;
        setPortfolioData({
          githubLink: u.portfolioLinks?.[0] || "",
          linkedinLink: u.portfolioLinks?.[1] || "",
          portfolioLink: u.portfolioLinks?.[2] || "",
          bio: u.bio || "",
          projects: u.projects || [],
        });
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      toast.error("Unable to load portfolio");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error("Project title and description are required");
      return;
    }

    // convert comma‑separated technologies into an array
    const techArray = newProject.technologies
      ? newProject.technologies.split(",").map((t) => t.trim())
      : [];

    setPortfolioData((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...newProject, technologies: techArray }],
    }));

    setNewProject({
      title: "",
      description: "",
      projectLink: "",
      technologies: "",
    });

    toast.success("Project added!");
  };

  const removeProject = (i) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== i),
    }));
    toast.info("Project removed");
  };

  const savePortfolio = async () => {
    setSaving(true);
    try {
      const body = {
        portfolioLinks: [
          portfolioData.githubLink,
          portfolioData.linkedinLink,
          portfolioData.portfolioLink,
        ].filter(Boolean),
        bio: portfolioData.bio,
        projects: portfolioData.projects,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };

      const { data } = await axios.post(`${API_BASE_URL}/portfolio`, body, config);
      if (data.success) toast.success("Portfolio updated successfully!");
      else toast.error(data.message || "Failed to update portfolio");
    } catch (err) {
      console.error("Error saving portfolio:", err);
      toast.error(
        err.response?.data?.message || "Error saving portfolio. Try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isLogin) return <Loader />;

  return (
    <>
      <MetaData title="My Portfolio" />
      <div className="bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white">
        {loading ? (
          <Loader />
        ) : (
          <div className="max-w-4xl mx-auto py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">My Portfolio</h1>
              <p className="text-gray-400 mt-2">
                Showcase your links and projects
              </p>
            </div>

            {/* Grid: Links + New Project */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Links & Bio */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg mb-2">GitHub Profile</label>
                  <input
                    name="githubLink"
                    value={portfolioData.githubLink}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg mb-2">LinkedIn Profile</label>
                  <input
                    name="linkedinLink"
                    value={portfolioData.linkedinLink}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg mb-2">Portfolio Website</label>
                  <input
                    name="portfolioLink"
                    value={portfolioData.portfolioLink}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg mb-2">About Me</label>
                  <textarea
                    name="bio"
                    value={portfolioData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Write a short introduction about yourself..."
                    className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                </div>
              </div>

              {/* Right: Add Project */}
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded">
                  <h3 className="text-xl font-semibold mb-4">Add Project</h3>
                  <div className="space-y-3">
                    <input
                      name="title"
                      value={newProject.title}
                      onChange={handleProjectChange}
                      placeholder="Project Title"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 outline-none"
                    />
                    <textarea
                      name="description"
                      value={newProject.description}
                      onChange={handleProjectChange}
                      placeholder="Project Description"
                      rows="2"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 outline-none"
                    />
                    <input
                      name="projectLink"
                      value={newProject.projectLink}
                      onChange={handleProjectChange}
                      placeholder="Project Live Demo / GitHub Link"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 outline-none"
                    />
                    <input
                      name="technologies"
                      value={newProject.technologies}
                      onChange={handleProjectChange}
                      placeholder="Technologies (comma separated)"
                      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 outline-none"
                    />
                    <button
                      onClick={addProject}
                      className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            {portfolioData.projects.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Your Projects ({portfolioData.projects.length})
                </h3>
                <div className="space-y-4">
                  {portfolioData.projects.map((project, i) => (
                    <div key={i} className="bg-gray-800 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold">
                            {project.title}
                          </h4>
                          <p className="text-gray-300 mt-2">
                            {project.description}
                          </p>

                          {project.projectLink && (
                            <a
                              href={project.projectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-400 hover:underline mt-2 block"
                            >
                              View Project →
                            </a>
                          )}

                          {project.technologies && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(Array.isArray(project.technologies)
                                ? project.technologies
                                : project.technologies
                                  .split(",")
                                  .map((t) => t.trim())
                              ).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-700 px-2 py-1 rounded text-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeProject(i)}
                          className="text-red-400 hover:text-red-300 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-8 text-center">
              <button
                onClick={savePortfolio}
                disabled={saving}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Portfolio"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};